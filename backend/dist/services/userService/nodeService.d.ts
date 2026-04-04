import { type INodeService } from "./interface/INodeService.js";
import { type INodeRepo } from "../../repositories/userRepo/nodeTreeRepo/InodeTreeRepo.js";
import { type INode } from "../../models/NodeModel.js";
export declare class NodeService implements INodeService {
    private _nodeRepo;
    constructor(nodeRepo: INodeRepo);
    createNode(name: string, userId: string, parentId?: string | null): Promise<INode>;
    getNodeById(nodeId: string, userId: string): Promise<INode | null>;
    getAllRootNodes(userId: string): Promise<INode[]>;
    getChildNodes(parentId: string, userId: string): Promise<INode[]>;
    updateNode(nodeId: string, userId: string, name: string): Promise<INode | null>;
    deleteNode(nodeId: string, userId: string): Promise<void>;
    getFullTree(userId: string): Promise<any[]>;
    private buildTree;
}
//# sourceMappingURL=nodeService.d.ts.map