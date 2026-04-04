import {} from "express";
import {} from "./interface/IUserAuthController.js";
import {} from "../../services/userService/interface/IUserAuthService.js";
import { ValidationHelper } from "../../utils/validation.js";
export class UserController {
    _userService;
    constructor(userService) {
        this._userService = userService;
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({
                    success: false,
                    message: "Email and password are required",
                });
                return;
            }
            const emailValidation = ValidationHelper.validateEmail(email);
            if (!emailValidation.isValid) {
                res.status(400).json({
                    success: false,
                    message: emailValidation.message,
                });
                return;
            }
            const passwordValidation = ValidationHelper.validatePassword(password);
            if (!passwordValidation.isValid) {
                res.status(400).json({
                    success: false,
                    message: passwordValidation.message,
                });
                return;
            }
            const sanitizedEmail = ValidationHelper.sanitizeEmail(email);
            const result = await this._userService.login({
                email: sanitizedEmail,
                password,
            });
            if (!result.success) {
                res.status(401).json({
                    success: false,
                    message: result.message,
                });
                return;
            }
            const isProduction = process.env.NODE_ENV === "production";
            const cookieOptions = {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/",
            };
            const statusCode = result.message.includes("created") ? 201 : 200;
            res
                .status(statusCode)
                .cookie("accessToken", result.accessToken, cookieOptions)
                .cookie("refreshToken", result.refreshToken, cookieOptions)
                .json({
                success: true,
                message: result.message,
                user: result.user,
            });
        }
        catch (error) {
            console.error("Login Error:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async logout(_req, res) {
        try {
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
                path: "/",
            };
            res.clearCookie("accessToken", cookieOptions);
            res.clearCookie("refreshToken", cookieOptions);
            res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });
        }
        catch (error) {
            console.error("Logout Error:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
//# sourceMappingURL=userAuthController.js.map