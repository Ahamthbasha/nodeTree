import {type INode } from "../../../models/NodeModel";

export interface INodeService {
  createNode(
    name: string,
    userId: string,
    parentId?: string | null
  ): Promise<INode>;
  getNodeById(nodeId: string, userId: string): Promise<INode | null>;
  getAllRootNodes(userId: string): Promise<INode[]>;
  getChildNodes(parentId: string, userId: string): Promise<INode[]>;
  updateNode(nodeId: string, userId: string, name: string): Promise<INode | null>;
  deleteNode(nodeId: string, userId: string): Promise<void>;
  getFullTree(userId: string): Promise<any[]>;
}