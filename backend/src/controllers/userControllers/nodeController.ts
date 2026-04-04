import {type Response } from "express";
import {type INodeController } from "./interface/INodeController.js";
import {type INodeService } from "../../services/userService/interface/INodeService.js";
import { StatusCode } from "../../utils/enums.js";
import {type AuthenticatedRequest } from "../../interface/express.js";

export class NodeController implements INodeController {
  private _nodeService: INodeService;

  constructor(nodeService: INodeService) {
    this._nodeService = nodeService;
  }

  // Helper method to extract string parameter
  private getStringParam(param: string | string[] | undefined): string | null {
    if (!param || Array.isArray(param)) {
      return null;
    }
    return param;
  }

  createNode = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { name, parentId } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      if (!name) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Node name is required",
        });
        return;
      }

      // Ensure parentId is a string or null
      const validParentId = parentId && typeof parentId === 'string' ? parentId : null;
      const node = await this._nodeService.createNode(name, userId, validParentId);

      res.status(StatusCode.CREATED).json({
        success: true,
        message: "Node created successfully",
        data: node,
      });
    } catch (error: any) {
      console.error("Create node error:", error);
      res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to create node",
      });
    }
  };

  getNodeById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { nodeId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      // Extract string parameter
      const validNodeId = this.getStringParam(nodeId);
      if (!validNodeId) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Valid Node ID is required",
        });
        return;
      }

      const node = await this._nodeService.getNodeById(validNodeId, userId);

      if (!node) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: "Node not found",
        });
        return;
      }

      res.status(StatusCode.OK).json({
        success: true,
        data: node,
      });
    } catch (error: any) {
      console.error("Get node error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to get node",
      });
    }
  };

  getAllRootNodes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const nodes = await this._nodeService.getAllRootNodes(userId);

      res.status(StatusCode.OK).json({
        success: true,
        data: nodes,
      });
    } catch (error: any) {
      console.error("Get root nodes error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to get root nodes",
      });
    }
  };

  getChildNodes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { parentId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      // Extract string parameter
      const validParentId = this.getStringParam(parentId);
      if (!validParentId) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Valid Parent ID is required",
        });
        return;
      }

      const nodes = await this._nodeService.getChildNodes(validParentId, userId);

      res.status(StatusCode.OK).json({
        success: true,
        data: nodes,
      });
    } catch (error: any) {
      console.error("Get child nodes error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to get child nodes",
      });
    }
  };

  updateNode = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { nodeId } = req.params;
      const { name } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      // Extract string parameter
      const validNodeId = this.getStringParam(nodeId);
      if (!validNodeId) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Valid Node ID is required",
        });
        return;
      }

      if (!name) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Node name is required",
        });
        return;
      }

      const node = await this._nodeService.updateNode(validNodeId, userId, name);

      if (!node) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: "Node not found",
        });
        return;
      }

      res.status(StatusCode.OK).json({
        success: true,
        message: "Node updated successfully",
        data: node,
      });
    } catch (error: any) {
      console.error("Update node error:", error);
      res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to update node",
      });
    }
  };

  deleteNode = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { nodeId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      // Extract string parameter
      const validNodeId = this.getStringParam(nodeId);
      if (!validNodeId) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Valid Node ID is required",
        });
        return;
      }

      await this._nodeService.deleteNode(validNodeId, userId);

      res.status(StatusCode.OK).json({
        success: true,
        message: "Node and all its descendants deleted successfully",
      });
    } catch (error: any) {
      console.error("Delete node error:", error);
      res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to delete node",
      });
    }
  };

  getFullTree = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const tree = await this._nodeService.getFullTree(userId);

      res.status(StatusCode.OK).json({
        success: true,
        data: tree,
      });
    } catch (error: any) {
      console.error("Get full tree error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to get tree structure",
      });
    }
  };
}