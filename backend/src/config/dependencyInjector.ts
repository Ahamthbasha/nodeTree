import { type IUserRepo } from "../repositories/userRepo/userAuthRepo/IUserAuthRepo";
import { UserRepo } from "../repositories/userRepo/userAuthRepo/userAuthRepo";
import { type IUserService } from "../services/userService/interface/IUserAuthService";
import { UserService } from "../services/userService/userAuthService";
import { type IUserController } from "../controllers/userControllers/interface/IUserAuthController";
import { UserController } from "../controllers/userControllers/userAuthController";

import { type IHashService } from "../services/commonService/interface/IHashService";
import { HashService } from "../services/commonService/hashService";

import { type IJwtService } from "../services/commonService/interface/IJwtService";
import { JwtService } from "../services/commonService/jwtService";
import { AuthMiddleware } from "../middlewares/authToken";

import {type INodeRepo } from "../repositories/userRepo/nodeTreeRepo/InodeTreeRepo";
import { NodeRepo } from "../repositories/userRepo/nodeTreeRepo/nodeTreeRepo";
import {type INodeService } from "../services/userService/interface/INodeService";
import { NodeService } from "../services/userService/nodeService";
import {type INodeController } from "../controllers/userControllers/interface/INodeController";
import { NodeController } from "../controllers/userControllers/nodeController";


const hashService: IHashService = new HashService();
const jwtService: IJwtService = new JwtService();
const authMiddleware = new AuthMiddleware(jwtService);

const userRepo: IUserRepo = new UserRepo();
const userService: IUserService = new UserService(userRepo, hashService, jwtService);
const userController: IUserController = new UserController(userService);

const userNodeRepo : INodeRepo = new NodeRepo()
const userNodeService : INodeService = new NodeService(userNodeRepo)
const userNodeController : INodeController = new NodeController(userNodeService)

export {
  userController,
  authMiddleware,
  userNodeController
};