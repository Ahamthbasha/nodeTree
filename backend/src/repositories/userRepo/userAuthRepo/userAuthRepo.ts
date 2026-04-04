import { GenericRepo } from '../../genericRepo/genericRepo.js'; 
import {type IUserRepo } from '../userAuthRepo/IUserAuthRepo.js'
import User, {type IUser } from '../../../models/userModel.js'

export class UserRepo extends GenericRepo<IUser> implements IUserRepo {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.findOne({ email: email.toLowerCase() });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.findOne({ email: email.toLowerCase() });
    return user !== null;
  }
}