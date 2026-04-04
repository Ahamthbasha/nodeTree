import { type IUser } from "../../../models/userModel.js";
import { type IGenericRepo } from "../../genericRepo/IGenericRepo.js";
export interface IUserRepo extends IGenericRepo<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
    existsByEmail(email: string): Promise<boolean>;
}
//# sourceMappingURL=IUserAuthRepo.d.ts.map