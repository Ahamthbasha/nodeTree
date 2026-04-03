import {type IUser } from "../../../models/userModel";
import {type IGenericRepo } from "../../genericRepo/IGenericRepo"; 

export interface IUserRepo extends IGenericRepo<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  existsByEmail(email: string): Promise<boolean>;
}