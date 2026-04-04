import { GenericRepo } from '../../genericRepo/genericRepo.js';
import { type IUserRepo } from '../userAuthRepo/IUserAuthRepo.js';
import { type IUser } from '../../../models/userModel.js';
export declare class UserRepo extends GenericRepo<IUser> implements IUserRepo {
    constructor();
    findByEmail(email: string): Promise<IUser | null>;
    existsByEmail(email: string): Promise<boolean>;
}
//# sourceMappingURL=userAuthRepo.d.ts.map