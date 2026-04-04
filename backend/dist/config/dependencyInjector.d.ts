import { type IUserController } from "../controllers/userControllers/interface/IUserAuthController.js";
import { AuthMiddleware } from "../middlewares/authToken.js";
import { type INodeController } from "../controllers/userControllers/interface/INodeController.js";
declare const authMiddleware: AuthMiddleware;
declare const userController: IUserController;
declare const userNodeController: INodeController;
export { userController, authMiddleware, userNodeController };
//# sourceMappingURL=dependencyInjector.d.ts.map