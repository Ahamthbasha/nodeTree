import {type INodeRepo } from "./InodeTreeRepo.js";
import { Node,type INode } from '../../../models/NodeModel.js';
import { GenericRepo } from "../../genericRepo/genericRepo.js";
import mongoose from "mongoose";

export class NodeRepo extends GenericRepo<INode> implements INodeRepo {
  constructor() {
    super(Node);
  }

  async createNode(
    name: string,
    userId: string,
    parentId: string | null = null
  ): Promise<INode> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create new node using generic repo method
      const newNode = await this.create({
        name,
        userId,
        parentId,
        children: [],
      } as Partial<INode>);

      // If this is a child node, add it to parent's children array
      if (parentId) {
        const parentNode = await this.findOne({ _id: parentId, userId });
        if (parentNode) {
          const updatedChildren = [...(parentNode.children || []), newNode._id.toString()];
          await this.update(parentId, { children: updatedChildren } as Partial<INode>, session);
        }
      }

      await session.commitTransaction();
      return newNode;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findNodeById(nodeId: string, userId: string): Promise<INode | null> {
    return await this.findOne({ _id: nodeId, userId });
  }

  async findAllRootNodes(userId: string): Promise<INode[]> {
    return await this.findAll({ userId, parentId: null });
  }

  async findChildNodes(parentId: string, userId: string): Promise<INode[]> {
    return await this.findAll({ userId, parentId });
  }

  async updateNode(
    nodeId: string,
    userId: string,
    name: string
  ): Promise<INode | null> {
    // First verify the node belongs to the user
    const node = await this.findOne({ _id: nodeId, userId });
    if (!node) {
      return null;
    }
    
    return await this.update(nodeId, { 
      name, 
      updatedAt: new Date() 
    } as Partial<INode>);
  }

  async deleteNode(nodeId: string, userId: string): Promise<void> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Get all descendants
      const descendants = await this.getAllDescendants(nodeId, userId);
      const allNodeIds = [nodeId, ...descendants];

      // Remove references from parent
      const node = await this.findOne({ _id: nodeId, userId });
      if (node && node.parentId) {
        const parentNode = await this.findOne({ _id: node.parentId, userId });
        if (parentNode) {
          const updatedChildren = (parentNode.children || []).filter(
            (childId) => childId !== nodeId
          );
          await this.update(node.parentId, { children: updatedChildren } as Partial<INode>, session);
        }
      }

      // Delete all nodes using generic repo method
      for (const id of allNodeIds) {
        await this.delete(id);
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getAllDescendants(nodeId: string, userId: string): Promise<string[]> {
    const descendants: string[] = [];
    const queue = [nodeId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
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

  async addChildToNode(
    nodeId: string,
    childId: string,
    userId: string
  ): Promise<void> {
    const node = await this.findOne({ _id: nodeId, userId });
    if (node) {
      const updatedChildren = [...(node.children || []), childId];
      await this.update(nodeId, { children: updatedChildren } as Partial<INode>);
    }
  }

  async removeChildFromNode(
    nodeId: string,
    childId: string,
    userId: string
  ): Promise<void> {
    const node = await this.findOne({ _id: nodeId, userId });
    if (node) {
      const updatedChildren = (node.children || []).filter(
        (id) => id !== childId
      );
      await this.update(nodeId, { children: updatedChildren } as Partial<INode>);
    }
  }
}