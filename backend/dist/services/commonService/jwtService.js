import jwt, {} from "jsonwebtoken";
import { env } from "../../config/env.js";
export class JwtService {
    _accessSecret;
    _refreshSecret;
    _accessExpiry;
    _refreshExpiry;
    constructor() {
        this._accessSecret = env.JWT_SECRET || "";
        this._refreshSecret = env.JWT_REFRESH_SECRET || "";
        this._accessExpiry = env.JWT_EXPIRATION || "15m";
        this._refreshExpiry = env.JWT_REFRESH_EXPIRATION || "7d";
        if (!this._accessSecret) {
            throw new Error("JWT_SECRET not found in environment variables");
        }
        if (!this._refreshSecret) {
            throw new Error("JWT_REFRESH_SECRET not found in environment variables");
        }
    }
    async generateAccessToken(payload) {
        return jwt.sign(payload, this._accessSecret, {
            expiresIn: this._accessExpiry,
        });
    }
    async generateRefreshToken(payload) {
        return jwt.sign(payload, this._refreshSecret, {
            expiresIn: this._refreshExpiry,
        });
    }
    async generateTokens(payload) {
        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(payload),
            this.generateRefreshToken(payload),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async verifyAccessToken(token) {
        try {
            const decoded = jwt.verify(token, this._accessSecret);
            return {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
            };
        }
        catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error("ACCESS_TOKEN_EXPIRED");
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new Error("INVALID_ACCESS_TOKEN");
            }
            throw new Error("ACCESS_TOKEN_VERIFICATION_FAILED");
        }
    }
    async verifyRefreshToken(token) {
        try {
            const decoded = jwt.verify(token, this._refreshSecret);
            return {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
            };
        }
        catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error("REFRESH_TOKEN_EXPIRED");
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new Error("INVALID_REFRESH_TOKEN");
            }
            throw new Error("REFRESH_TOKEN_VERIFICATION_FAILED");
        }
    }
}
//# sourceMappingURL=jwtService.js.map