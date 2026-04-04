import { type Response } from "express";
import { type INodeController } from "./interface/INodeController.js";
import { type INodeService } from "../../services/userService/interface/INodeService.js";
import { type AuthenticatedRequest } from "../../interface/express.js";
export declare class NodeController implements INodeController {
    private _nodeService;
    constructor(nodeService: INodeService);
    private getStringParam;
    createNode: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getNodeById: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getAllRootNodes: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getChildNodes: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    updateNode: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    deleteNode: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getFullTree: (req: AuthenticatedRequest, res: Response) => Promise<void>;
}
//# sourceMappingURL=nodeController.d.ts.map