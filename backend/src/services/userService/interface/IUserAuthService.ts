import type { ILoginRequest, IAuthResponse } from "../../../interface/IUserAuth.js";

export interface IUserService {
  login(data: ILoginRequest): Promise<IAuthResponse>;
}