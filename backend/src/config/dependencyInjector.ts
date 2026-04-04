import { type IUserRepo } from "../repositories/userRepo/userAuthRepo/IUserAuthRepo.js";
import { UserRepo } from "../repositories/userRepo/userAuthRepo/userAuthRepo.js";
import { type IUserService } from "../services/userService/interface/IUserAuthService.js";
import { UserService } from "../services/userService/userAuthService.js";
import { type IUserController } from "../controllers/userControllers/interface/IUserAuthController.js";
import { UserController } from "../controllers/userControllers/userAuthController.js";

import { type IHashService } from "../services/commonService/interface/IHashService.js";
import { HashService } from "../services/commonService/hashService.js";

import { type IJwtService } from "../services/commonService/interface/IJwtService.js";
import { JwtService } from "../services/commonService/jwtService.js";
import { AuthMiddleware } from "../middlewares/authToken.js";

import {type INodeRepo } from "../repositories/userRepo/nodeTreeRepo/InodeTreeRepo.js";
import { NodeRepo } from "../repositories/userRepo/nodeTreeRepo/nodeTreeRepo.js";
import {type INodeService } from "../services/userService/interface/INodeService.js";
import { NodeService } from "../services/userService/nodeService.js";
import {type INodeController } from "../controllers/userControllers/interface/INodeController.js";
import { NodeController } from "../controllers/userControllers/nodeController.js";


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