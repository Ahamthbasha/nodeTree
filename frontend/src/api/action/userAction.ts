import { API } from '../../service/axios';
import { userRouterEndPoints } from '../../types/endpoints/userEndPoint'; 
import type { 
  INode, 
  ITreeNode, 
  CreateNodeDto, 
  UpdateNodeDto, 
  ApiResponse,
  ApiError 
} from '../../types/interface/nodeInterface';

// Helper function to handle API errors
const handleApiError = (error: unknown): never => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: ApiError } };
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
  }
  if (error instanceof Error) {
    throw error;
  }
  throw new Error('An unknown error occurred');
};

export const createNode = async (data: CreateNodeDto): Promise<INode> => {
  try {
    const response = await API.post<ApiResponse<INode>>(
      userRouterEndPoints.createNode, 
      data
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create node');
    }
    if (!response.data.data) {
      throw new Error('No data returned from server');
    }
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get node by ID
export const getNodeById = async (nodeId: string): Promise<INode> => {
  try {
    const response = await API.get<ApiResponse<INode>>(
      userRouterEndPoints.getNodeById(nodeId)
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch node');
    }
    if (!response.data.data) {
      throw new Error('No data returned from server');
    }
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Update node
export const updateNode = async (nodeId: string, data: UpdateNodeDto): Promise<INode> => {
  try {
    const response = await API.put<ApiResponse<INode>>(
      userRouterEndPoints.updateNode(nodeId), 
      data
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update node');
    }
    if (!response.data.data) {
      throw new Error('No data returned from server');
    }
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Delete node
export const deleteNode = async (nodeId: string): Promise<void> => {
  try {
    const response = await API.delete<ApiResponse<undefined>>(
      userRouterEndPoints.deleteNode(nodeId)
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete node');
    }
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get all root nodes
export const getAllRootNodes = async (): Promise<INode[]> => {
  try {
    const response = await API.get<ApiResponse<INode[]>>(
      userRouterEndPoints.getAllRootNodes
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch root nodes');
    }
    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get child nodes
export const getChildNodes = async (parentId: string): Promise<INode[]> => {
  try {
    const response = await API.get<ApiResponse<INode[]>>(
      userRouterEndPoints.getChildNodes(parentId)
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch child nodes');
    }
    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get full tree
export const getFullTree = async (): Promise<ITreeNode[]> => {
  try {
    const response = await API.get<ApiResponse<ITreeNode[]>>(
      userRouterEndPoints.getFullTree
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch tree');
    }
    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
};