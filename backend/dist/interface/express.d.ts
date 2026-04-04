import { type Request } from "express";
import { type IJwtPayload } from "../services/commonService/interface/IJwtService.js";
export interface AuthenticatedRequest extends Request {
    user?: IJwtPayload;
}
//# sourceMappingURL=express.d.ts.map