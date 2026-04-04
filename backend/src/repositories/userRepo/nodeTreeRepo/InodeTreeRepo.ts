import {type INode } from "../../../models/NodeModel.js"; 

export interface INodeRepo {
  createNode(
    name: string,
    userId: string,
    parentId?: string | null
  ): Promise<INode>;
  findNodeById(nodeId: string, userId: string): Promise<INode | null>;
  findAllRootNodes(userId: string): Promise<INode[]>;
  findChildNodes(parentId: string, userId: string): Promise<INode[]>;
  updateNode(nodeId: string, userId: string, name: string): Promise<INode | null>;
  deleteNode(nodeId: string, userId: string): Promise<void>;
  getAllDescendants(nodeId: string, userId: string): Promise<string[]>;
  addChildToNode(nodeId: string, childId: string, userId: string): Promise<void>;
  removeChildFromNode(nodeId: string, childId: string, userId: string): Promise<void>;
}