import {type INodeService } from "./interface/INodeService";
import {type INodeRepo } from "../../repositories/userRepo/nodeTreeRepo/InodeTreeRepo";
import {type INode } from "../../models/NodeModel";

export class NodeService implements INodeService {
  private _nodeRepo: INodeRepo;

  constructor(nodeRepo: INodeRepo) {
    this._nodeRepo = nodeRepo;
  }

  async createNode(
    name: string,
    userId: string,
    parentId: string | null = null
  ): Promise<INode> {
    // Validate input
    if (!name || name.trim().length === 0) {
      throw new Error("Node name is required");
    }

    if (name.length > 100) {
      throw new Error("Node name cannot exceed 100 characters");
    }

    // Check if parent exists if parentId is provided
    if (parentId) {
      const parentNode = await this._nodeRepo.findNodeById(parentId, userId);
      if (!parentNode) {
        throw new Error("Parent node not found");
      }
    }

    return await this._nodeRepo.createNode(name.trim(), userId, parentId);
  }

  async getNodeById(nodeId: string, userId: string): Promise<INode | null> {
    return await this._nodeRepo.findNodeById(nodeId, userId);
  }

  async getAllRootNodes(userId: string): Promise<INode[]> {
    return await this._nodeRepo.findAllRootNodes(userId);
  }

  async getChildNodes(parentId: string, userId: string): Promise<INode[]> {
    return await this._nodeRepo.findChildNodes(parentId, userId);
  }

  async updateNode(
    nodeId: string,
    userId: string,
    name: string
  ): Promise<INode | null> {
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

  async deleteNode(nodeId: string, userId: string): Promise<void> {
    const node = await this._nodeRepo.findNodeById(nodeId, userId);
    if (!node) {
      throw new Error("Node not found");
    }

    await this._nodeRepo.deleteNode(nodeId, userId);
  }

  async getFullTree(userId: string): Promise<any[]> {
    const rootNodes = await this._nodeRepo.findAllRootNodes(userId);
    const tree = [];

    for (const rootNode of rootNodes) {
      const nodeTree = await this.buildTree(rootNode, userId);
      tree.push(nodeTree);
    }

    return tree;
  }

  private async buildTree(node: INode, userId: string): Promise<any> {
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