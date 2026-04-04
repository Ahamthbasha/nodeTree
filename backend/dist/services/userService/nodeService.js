import {} from "./interface/INodeService.js";
import {} from "../../repositories/userRepo/nodeTreeRepo/InodeTreeRepo.js";
import {} from "../../models/NodeModel.js";
export class NodeService {
    _nodeRepo;
    constructor(nodeRepo) {
        this._nodeRepo = nodeRepo;
    }
    async createNode(name, userId, parentId = null) {
        if (!name || name.trim().length === 0) {
            throw new Error("Node name is required");
        }
        if (name.length > 100) {
            throw new Error("Node name cannot exceed 100 characters");
        }
        if (parentId) {
            const parentNode = await this._nodeRepo.findNodeById(parentId, userId);
            if (!parentNode) {
                throw new Error("Parent node not found");
            }
        }
        return await this._nodeRepo.createNode(name.trim(), userId, parentId);
    }
    async getNodeById(nodeId, userId) {
        return await this._nodeRepo.findNodeById(nodeId, userId);
    }
    async getAllRootNodes(userId) {
        return await this._nodeRepo.findAllRootNodes(userId);
    }
    async getChildNodes(parentId, userId) {
        return await this._nodeRepo.findChildNodes(parentId, userId);
    }
    async updateNode(nodeId, userId, name) {
        if (!name || name.trim().length === 0) {
            throw new Error("Node name is required");
        }
        if (name.length > 100) {
            throw new Error("Node name cannot exceed 100 characters");
        }
        const node = await this._nodeRepo.findNodeById(nodeId, userId);
        if (!node) {
            throw new Error("Node not found");
        }
        return await this._nodeRepo.updateNode(nodeId, userId, name.trim());
    }
    async deleteNode(nodeId, userId) {
        const node = await this._nodeRepo.findNodeById(nodeId, userId);
        if (!node) {
            throw new Error("Node not found");
        }
        await this._nodeRepo.deleteNode(nodeId, userId);
    }
    async getFullTree(userId) {
        const rootNodes = await this._nodeRepo.findAllRootNodes(userId);
        const tree = [];
        for (const rootNode of rootNodes) {
            const nodeTree = await this.buildTree(rootNode, userId);
            tree.push(nodeTree);
        }
        return tree;
    }
    async buildTree(node, userId) {
        const children = await this._nodeRepo.findChildNodes(node._id.toString(), userId);
        const childrenTree = [];
        for (const child of children) {
            const childTree = await this.buildTree(child, userId);
            childrenTree.push(childTree);
        }
        return {
            id: node._id,
            name: node.name,
            parentId: node.parentId,
            children: childrenTree,
            createdAt: node.createdAt,
            updatedAt: node.updatedAt,
        };
    }
}
//# sourceMappingURL=nodeService.js.map