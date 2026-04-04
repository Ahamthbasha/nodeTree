import { type Request, type Response } from "express";
import { type IUserController } from "./interface/IUserAuthController.js";
import { type IUserService } from "../../services/userService/interface/IUserAuthService.js";
export declare class UserController implements IUserController {
    private _userService;
    constructor(userService: IUserService);
    login(req: Request, res: Response): Promise<void>;
    logout(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=userAuthController.d.ts.map