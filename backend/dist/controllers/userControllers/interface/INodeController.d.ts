import { type Request, type Response } from "express";
export interface INodeController {
    createNode(req: Request, res: Response): Promise<void>;
    getNodeById(req: Request, res: Response): Promise<void>;
    getAllRootNodes(req: Request, res: Response): Promise<void>;
    getChildNodes(req: Request, res: Response): Promise<void>;
    updateNode(req: Request, res: Response): Promise<void>;
    deleteNode(req: Request, res: Response): Promise<void>;
    getFullTree(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=INodeController.d.ts.map