import type { ILoginRequest, IAuthResponse } from "../../../interface/IUserAuth";

export interface IUserService {
  login(data: ILoginRequest): Promise<IAuthResponse>;
}