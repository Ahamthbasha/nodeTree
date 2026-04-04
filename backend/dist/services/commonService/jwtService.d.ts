import type { IJwtPayload, IJwtService, ITokens } from "./interface/IJwtService.js";
export declare class JwtService implements IJwtService {
    private _accessSecret;
    private _refreshSecret;
    private _accessExpiry;
    private _refreshExpiry;
    constructor();
    generateAccessToken(payload: IJwtPayload): Promise<string>;
    generateRefreshToken(payload: IJwtPayload): Promise<string>;
    generateTokens(payload: IJwtPayload): Promise<ITokens>;
    verifyAccessToken(token: string): Promise<IJwtPayload>;
    verifyRefreshToken(token: string): Promise<IJwtPayload>;
}
//# sourceMappingURL=jwtService.d.ts.map