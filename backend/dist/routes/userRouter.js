import { Router } from "express";
import { authMiddleware, userController, userNodeController } from "../config/dependencyInjector.js";
const router = Router();
router.post("/login", userController.login.bind(userController));
router.post("/logout", userController.logout.bind(userController));
router.post('/nodes', authMiddleware.authenticateToken, userNodeController.createNode.bind(userNodeController));
router.get('/nodes/:nodeId', authMiddleware.authenticateToken, userNodeController.getNodeById.bind(userNodeController));
router.put('/nodes/:nodeId', authMiddleware.authenticateToken, userNodeController.updateNode.bind(userNodeController));
router.delete('/nodes/:nodeId', authMiddleware.authenticateToken, userNodeController.deleteNode.bind(userNodeController));
router.get('/nodes/root/all', authMiddleware.authenticateToken, userNodeController.getAllRootNodes.bind(userNodeController));
router.get('/nodes/children/:parentId', authMiddleware.authenticateToken, userNodeController.getChildNodes.bind(userNodeController));
router.get('/tree/full', authMiddleware.authenticateToken, userNodeController.getFullTree.bind(userNodeController));
export default router;
//# sourceMappingURL=userRouter.js.map