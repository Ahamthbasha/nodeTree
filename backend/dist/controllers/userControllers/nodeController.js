import {} from "express";
import {} from "./interface/INodeController.js";
import {} from "../../services/userService/interface/INodeService.js";
import { StatusCode } from "../../utils/enums.js";
import {} from "../../interface/express.js";
export class NodeController {
    _nodeService;
    constructor(nodeService) {
        this._nodeService = nodeService;
    }
    getStringParam(param) {
        if (!param || Array.isArray(param)) {
            return null;
        }
        return param;
    }
    createNode = async (req, res) => {
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
            const validParentId = parentId && typeof parentId === 'string' ? parentId : null;
            const node = await this._nodeService.createNode(name, userId, validParentId);
            res.status(StatusCode.CREATED).json({
                success: true,
                message: "Node created successfully",
                data: node,
            });
        }
        catch (error) {
            console.error("Create node error:", error);
            res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: error.message || "Failed to create node",
            });
        }
    };
    getNodeById = async (req, res) => {
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
        }
        catch (error) {
            console.error("Get node error:", error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to get node",
            });
        }
    };
    getAllRootNodes = async (req, res) => {
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
        }
        catch (error) {
            console.error("Get root nodes error:", error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to get root nodes",
            });
        }
    };
    getChildNodes = async (req, res) => {
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
        }
        catch (error) {
            console.error("Get child nodes error:", error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to get child nodes",
            });
        }
    };
    updateNode = async (req, res) => {
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
        }
        catch (error) {
            console.error("Update node error:", error);
            res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: error.message || "Failed to update node",
            });
        }
    };
    deleteNode = async (req, res) => {
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
        }
        catch (error) {
            console.error("Delete node error:", error);
            res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: error.message || "Failed to delete node",
            });
        }
    };
    getFullTree = async (req, res) => {
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
        }
        catch (error) {
            console.error("Get full tree error:", error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to get tree structure",
            });
        }
    };
}
//# sourceMappingURL=nodeController.js.map