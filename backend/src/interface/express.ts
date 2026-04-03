import {type Request } from "express";
import {type IJwtPayload } from "../services/commonService/interface/IJwtService";

export interface AuthenticatedRequest extends Request {
  user?: IJwtPayload;
}