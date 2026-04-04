import { GenericRepo } from '../../genericRepo/genericRepo.js';
import {} from '../userAuthRepo/IUserAuthRepo.js';
import User, {} from '../../../models/userModel.js';
export class UserRepo extends GenericRepo {
    constructor() {
        super(User);
    }
    async findByEmail(email) {
        return await this.findOne({ email: email.toLowerCase() });
    }
    async existsByEmail(email) {
        const user = await this.findOne({ email: email.toLowerCase() });
        return user !== null;
    }
}
//# sourceMappingURL=userAuthRepo.js.map