import { type Response, type NextFunction } from "express";
import { type IJwtService } from "../services/commonService/interface/IJwtService.js";
import { type AuthenticatedRequest } from "../interface/express.js";
export declare class AuthMiddleware {
    private _jwtService;
    constructor(jwtService: IJwtService);
    authenticateToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=authToken.d.ts.map