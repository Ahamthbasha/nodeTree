import {type Response,type NextFunction } from "express";
import {type IJwtService } from "../services/commonService/interface/IJwtService.js"; 
import { StatusCode } from "../utils/enums.js";
import { AuthErrorMsg } from "../utils/constants.js"; 
import {type AuthenticatedRequest } from "../interface/express.js"; 

export class AuthMiddleware {
  private _jwtService: IJwtService;

  constructor(jwtService: IJwtService) {
    this._jwtService = jwtService;
  }

  authenticateToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const accessToken = req.cookies?.accessToken;
      const refreshToken = req.cookies?.refreshToken;

      // No access token found
      if (!accessToken) {
        console.log("❌ No accessToken found in cookies");
        res.status(StatusCode.UNAUTHORIZED).json({
          failToken: true,
          message: AuthErrorMsg.NO_ACCESS_TOKEN,
        });
        return;
      }

      try {
        // Try verifying access token
        const decoded = await this._jwtService.verifyAccessToken(accessToken);
        req.user = decoded;
        next();
      } catch (error: any) {
        // Access token expired - attempt to refresh
        if (error.message === "ACCESS_TOKEN_EXPIRED") {
          console.log("⏰ Access token expired, attempting refresh...");

          if (!refreshToken) {
            console.log("❌ No refresh token found");
            res.status(StatusCode.UNAUTHORIZED).json({
              failToken: true,
              message: AuthErrorMsg.NO_REFRESH_TOKEN,
            });
            return;
          }

          try {
            // Verify refresh token
            const refreshPayload = await this._jwtService.verifyRefreshToken(
              refreshToken
            );

            // Generate new access token
            const newAccessToken = await this._jwtService.generateAccessToken({
              id: refreshPayload.id,
              email: refreshPayload.email,
              role: refreshPayload.role,
            });

            // Set consistent cookie options (matching login)
            const isProduction = process.env.NODE_ENV === "production";

            const cookieOptions = {
              httpOnly: true,
              secure: isProduction,
              sameSite: isProduction ? ("none" as const) : ("lax" as const),
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
              path: "/",
            };

            // Set new access token cookie
            res.cookie("accessToken", newAccessToken, cookieOptions);

            console.log("🔄 Access token refreshed successfully");

            // **IMPORTANT: Add header to indicate token was refreshed**
            res.setHeader("X-Token-Refreshed", "true");

            // Attach user to request and continue
            req.user = refreshPayload;
            next();
          } catch (refreshError: any) {
            console.log("❌ Refresh token verification failed:", refreshError.message);

            if (refreshError.message === "REFRESH_TOKEN_EXPIRED") {
              res.status(StatusCode.UNAUTHORIZED).json({
                failToken: true,
                message: AuthErrorMsg.REFRESH_TOKEN_EXPIRED,
              });
              return;
            }

            res.status(StatusCode.UNAUTHORIZED).json({
              failToken: true,
              message: AuthErrorMsg.INVALID_REFRESH_TOKEN,
            });
            return;
          }
        } else {
          // Other token errors (invalid signature, malformed, etc.)
          console.log("❌ Access token verification failed:", error.message);
          res.status(StatusCode.UNAUTHORIZED).json({
            failToken: true,
            message: AuthErrorMsg.INVALID_ACCESS_TOKEN,
          });
          return;
        }
      }
    } catch (error) {
      // Unexpected errors
      console.error("❌ Unexpected error in auth middleware:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        failToken: true,
        message: "Authentication error occurred",
      });
      return;
    }
  };
}