import type { IUserService } from "./interface/IUserAuthService.js";
import type { IUserRepo } from "../../repositories/userRepo/userAuthRepo/IUserAuthRepo.js";
import type { IHashService } from "../commonService/interface/IHashService.js";
import type { IJwtService } from "../commonService/interface/IJwtService.js";
import type { ILoginRequest, IAuthResponse } from "../../interface/IUserAuth.js";
export declare class UserService implements IUserService {
    private _userRepo;
    private _hashService;
    private _jwtService;
    constructor(userRepo: IUserRepo, hashService: IHashService, jwtService: IJwtService);
    login(data: ILoginRequest): Promise<IAuthResponse>;
}
//# sourceMappingURL=userAuthService.d.ts.map