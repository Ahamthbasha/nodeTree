import {} from "express";
import {} from "../services/commonService/interface/IJwtService.js";
import { StatusCode } from "../utils/enums.js";
import { AuthErrorMsg } from "../utils/constants.js";
import {} from "../interface/express.js";
export class AuthMiddleware {
    _jwtService;
    constructor(jwtService) {
        this._jwtService = jwtService;
    }
    authenticateToken = async (req, res, next) => {
        try {
            const accessToken = req.cookies?.accessToken;
            const refreshToken = req.cookies?.refreshToken;
            if (!accessToken) {
                console.log("❌ No accessToken found in cookies");
                res.status(StatusCode.UNAUTHORIZED).json({
                    failToken: true,
                    message: AuthErrorMsg.NO_ACCESS_TOKEN,
                });
                return;
            }
            try {
                const decoded = await this._jwtService.verifyAccessToken(accessToken);
                req.user = decoded;
                next();
            }
            catch (error) {
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
                        const refreshPayload = await this._jwtService.verifyRefreshToken(refreshToken);
                        const newAccessToken = await this._jwtService.generateAccessToken({
                            id: refreshPayload.id,
                            email: refreshPayload.email,
                            role: refreshPayload.role,
                        });
                        const isProduction = process.env.NODE_ENV === "production";
                        const cookieOptions = {
                            httpOnly: true,
                            secure: isProduction,
                            sameSite: isProduction ? "none" : "lax",
                            maxAge: 7 * 24 * 60 * 60 * 1000,
                            path: "/",
                        };
                        res.cookie("accessToken", newAccessToken, cookieOptions);
                        console.log("🔄 Access token refreshed successfully");
                        res.setHeader("X-Token-Refreshed", "true");
                        req.user = refreshPayload;
                        next();
                    }
                    catch (refreshError) {
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
                }
                else {
                    console.log("❌ Access token verification failed:", error.message);
                    res.status(StatusCode.UNAUTHORIZED).json({
                        failToken: true,
                        message: AuthErrorMsg.INVALID_ACCESS_TOKEN,
                    });
                    return;
                }
            }
        }
        catch (error) {
            console.error("❌ Unexpected error in auth middleware:", error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                failToken: true,
                message: "Authentication error occurred",
            });
            return;
        }
    };
}
//# sourceMappingURL=authToken.js.map