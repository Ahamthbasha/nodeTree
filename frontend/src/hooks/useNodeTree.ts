import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { createNode, getFullTree, updateNode, deleteNode as deleteNodeApi } from '../api/action/userAction'
import {type ITreeNode,type INode,type ApiError } from '../types/interface/nodeInterface'

// Define error type
type ErrorWithMessage = {
  message: string;
};

// Helper function to get error message
const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as ErrorWithMessage).message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
};

// Check if error is API error
const isApiError = (error: unknown): error is ApiError => {
  return (
    error !== null &&
    typeof error === 'object' && 
    'success' in error && 
    'message' in error &&
    (error as ApiError).success === false
  );
};

export const useNodeTree = () => {
  const [tree, setTree] = useState<ITreeNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load full tree
  const loadTree = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFullTree();
      setTree(data);
    } catch (err: unknown) {
      const errorMessage = isApiError(err) 
        ? err.message 
        : getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add node
  const addNode = useCallback(async (name: string, parentId?: string | null): Promise<INode> => {
    try {
      const newNode = await createNode({ name, parentId });
      await loadTree();
      toast.success(`Node "${name}" created successfully`);
      return newNode;
    } catch (err: unknown) {
      const errorMessage = isApiError(err) 
        ? err.message 
        : getErrorMessage(err);
      toast.error(errorMessage);
      throw err;
    }
  }, [loadTree]);

  // Edit node
  const editNode = useCallback(async (nodeId: string, name: string): Promise<INode> => {
    try {
      const updatedNode = await updateNode(nodeId, { name });
      await loadTree();
      toast.success(`Node renamed to "${name}"`);
      return updatedNode;
    } catch (err: unknown) {
      const errorMessage = isApiError(err) 
        ? err.message 
        : getErrorMessage(err);
      toast.error(errorMessage);
      throw err;
    }
  }, [loadTree]);

  // Delete node
  const deleteNode = useCallback(async (nodeId: string): Promise<void> => {
    try {
      await deleteNodeApi(nodeId);
      await loadTree();
      toast.success('Node and its children deleted successfully');
    } catch (err: unknown) {
      const errorMessage = isApiError(err) 
        ? err.message 
        : getErrorMessage(err);
      toast.error(errorMessage);
      throw err;
    }
  }, [loadTree]);

  useEffect(() => {
    loadTree();
  }, [loadTree]);

  return {
    tree,
    loading,
    error,
    addNode,
    editNode,
    deleteNode,
    refreshTree: loadTree
  };
};