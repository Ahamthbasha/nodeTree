import {} from "./InodeTreeRepo.js";
import { Node } from '../../../models/NodeModel.js';
import { GenericRepo } from "../../genericRepo/genericRepo.js";
import mongoose from "mongoose";
export class NodeRepo extends GenericRepo {
    constructor() {
        super(Node);
    }
    async createNode(name, userId, parentId = null) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const newNode = await this.create({
                name,
                userId,
                parentId,
                children: [],
            });
            if (parentId) {
                const parentNode = await this.findOne({ _id: parentId, userId });
                if (parentNode) {
                    const updatedChildren = [...(parentNode.children || []), newNode._id.toString()];
                    await this.update(parentId, { children: updatedChildren }, session);
                }
            }
            await session.commitTransaction();
            return newNode;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async findNodeById(nodeId, userId) {
        return await this.findOne({ _id: nodeId, userId });
    }
    async findAllRootNodes(userId) {
        return await this.findAll({ userId, parentId: null });
    }
    async findChildNodes(parentId, userId) {
        return await this.findAll({ userId, parentId });
    }
    async updateNode(nodeId, userId, name) {
        const node = await this.findOne({ _id: nodeId, userId });
        if (!node) {
            return null;
        }
        return await this.update(nodeId, {
            name,
            updatedAt: new Date()
        });
    }
    async deleteNode(nodeId, userId) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const descendants = await this.getAllDescendants(nodeId, userId);
            const allNodeIds = [nodeId, ...descendants];
            const node = await this.findOne({ _id: nodeId, userId });
            if (node && node.parentId) {
                const parentNode = await this.findOne({ _id: node.parentId, userId });
                if (parentNode) {
                    const updatedChildren = (parentNode.children || []).filter((childId) => childId !== nodeId);
                    await this.update(node.parentId, { children: updatedChildren }, session);
                }
            }
            for (const id of allNodeIds) {
                await this.delete(id);
            }
            await session.commitTransaction();
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async getAllDescendants(nodeId, userId) {
        const descendants = [];
        const queue = [nodeId];
        while (queue.length > 0) {
            const currentId = queue.shift();
            const currentNode = await this.findOne({ _id: currentId, userId });
            if (currentNode && currentNode.children && currentNode.children.length > 0) {
                for (const childId of currentNode.children) {
                    descendants.push(childId);
                    queue.push(childId);
                }
            }
        }
        return descendants;
    }
    async addChildToNode(nodeId, childId, userId) {
        const node = await this.findOne({ _id: nodeId, userId });
        if (node) {
            const updatedChildren = [...(node.children || []), childId];
            await this.update(nodeId, { children: updatedChildren });
        }
    }
    async removeChildFromNode(nodeId, childId, userId) {
        const node = await this.findOne({ _id: nodeId, userId });
        if (node) {
            const updatedChildren = (node.children || []).filter((id) => id !== childId);
            await this.update(nodeId, { children: updatedChildren });
        }
    }
}
//# sourceMappingURL=nodeTreeRepo.js.map