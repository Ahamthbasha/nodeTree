import { API } from "../../service/axios";
import { userRouterEndPoints } from "../../types/endpoints/userEndPoint";
import type { Login } from "../../types/interface/userInterface";

export const login = async ({ email,name, password, role }: Login) => {
  const response = await API.post(userRouterEndPoints.userLogin, {
    email,
    password,
    name,
    role,
  });
  return response.data;
};

export const logout = async () => {
  const response = await API.post(userRouterEndPoints.userLogout, {});
  return response.data;
};