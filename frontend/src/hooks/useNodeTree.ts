// import { useState, useEffect, useCallback } from 'react';
// import { toast } from 'react-toastify';
// import { createNode, getFullTree, updateNode, deleteNode as deleteNodeApi } from '../api/action/userAction'
// import {type ITreeNode,type INode,type ApiError } from '../types/interface/nodeInterface'

// // Define error type
// type ErrorWithMessage = {
//   message: string;
// };

// // Helper function to get error message
// const getErrorMessage = (error: unknown): string => {
//   if (error && typeof error === 'object' && 'message' in error) {
//     return (error as ErrorWithMessage).message;
//   }
//   if (typeof error === 'string') {
//     return error;
//   }
//   return 'An unknown error occurred';
// };

// // Check if error is API error
// const isApiError = (error: unknown): error is ApiError => {
//   return (
//     error !== null &&
//     typeof error === 'object' && 
//     'success' in error && 
//     'message' in error &&
//     (error as ApiError).success === false
//   );
// };

// export const useNodeTree = () => {
//   const [tree, setTree] = useState<ITreeNode[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Load full tree
//   const loadTree = useCallback(async (): Promise<void> => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await getFullTree();
//       setTree(data);
//     } catch (err: unknown) {
//       const errorMessage = isApiError(err) 
//         ? err.message 
//         : getErrorMessage(err);
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Add node
//   const addNode = useCallback(async (name: string, parentId?: string | null): Promise<INode> => {
//     try {
//       const newNode = await createNode({ name, parentId });
//       await loadTree();
//       toast.success(`Node "${name}" created successfully`);
//       return newNode;
//     } catch (err: unknown) {
//       const errorMessage = isApiError(err) 
//         ? err.message 
//         : getErrorMessage(err);
//       toast.error(errorMessage);
//       throw err;
//     }
//   }, [loadTree]);

//   // Edit node
//   const editNode = useCallback(async (nodeId: string, name: string): Promise<INode> => {
//     try {
//       const updatedNode = await updateNode(nodeId, { name });
//       await loadTree();
//       toast.success(`Node renamed to "${name}"`);
//       return updatedNode;
//     } catch (err: unknown) {
//       const errorMessage = isApiError(err) 
//         ? err.message 
//         : getErrorMessage(err);
//       toast.error(errorMessage);
//       throw err;
//     }
//   }, [loadTree]);

//   // Delete node
//   const deleteNode = useCallback(async (nodeId: string): Promise<void> => {
//     try {
//       await deleteNodeApi(nodeId);
//       await loadTree();
//       toast.success('Node and its children deleted successfully');
//     } catch (err: unknown) {
//       const errorMessage = isApiError(err) 
//         ? err.message 
//         : getErrorMessage(err);
//       toast.error(errorMessage);
//       throw err;
//     }
//   }, [loadTree]);

//   useEffect(() => {
//     loadTree();
//   }, [loadTree]);

//   return {
//     tree,
//     loading,
//     error,
//     addNode,
//     editNode,
//     deleteNode,
//     refreshTree: loadTree
//   };
// };




















































































import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { createNode, getFullTree, updateNode, deleteNode as deleteNodeApi } from '../api/action/userAction';
import { type ITreeNode, type INode, type ApiError } from '../types/interface/nodeInterface';

type ErrorWithMessage = {
  message: string;
};

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as ErrorWithMessage).message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
};

const isApiError = (error: unknown): error is ApiError => {
  return (
    error !== null &&
    typeof error === 'object' && 
    'success' in error && 
    'message' in error &&
    (error as ApiError).success === false
  );
};

// Helper to merge old expanded state with new tree
const preserveExpandedState = (
  newTree: ITreeNode[], 
  expandedNodes: Set<string>
): ITreeNode[] => {
  const updateNodeExpanded = (node: ITreeNode): ITreeNode => {
    const wasExpanded = expandedNodes.has(node.id);
    return {
      ...node,
      isExpanded: wasExpanded, // Preserve expanded state
      children: node.children?.map(updateNodeExpanded) || []
    };
  };
  return newTree.map(updateNodeExpanded);
};

export const useNodeTree = () => {
  const [tree, setTree] = useState<ITreeNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Toggle node expansion
  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
    
    // Also update tree state for immediate UI feedback
    setTree(prevTree => {
      const updateNode = (nodes: ITreeNode[]): ITreeNode[] => {
        return nodes.map(node => {
          if (node.id === nodeId) {
            return { ...node, isExpanded: !node.isExpanded };
          }
          if (node.children) {
            return { ...node, children: updateNode(node.children) };
          }
          return node;
        });
      };
      return updateNode(prevTree);
    });
  }, []);

  // Load full tree and preserve expanded state
  const loadTree = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFullTree();
      
      // Preserve expanded state when loading new tree
      const treeWithExpanded = preserveExpandedState(data, expandedNodes);
      setTree(treeWithExpanded);
    } catch (err: unknown) {
      const errorMessage = isApiError(err) 
        ? err.message 
        : getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [expandedNodes]);

  // Add node - preserve expansion of parent
  const addNode = useCallback(async (name: string, parentId?: string | null): Promise<INode> => {
    try {
      const newNode = await createNode({ name, parentId });
      
      // If adding a child, ensure parent is expanded
      if (parentId) {
        setExpandedNodes(prev => new Set(prev).add(parentId));
      }
      
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

  // Edit node - preserve all expanded states
  const editNode = useCallback(async (nodeId: string, name: string): Promise<INode> => {
    try {
      const updatedNode = await updateNode(nodeId, { name });
      await loadTree(); // This will preserve expanded states via expandedNodes
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

  // Delete node - preserve all expanded states
  const deleteNode = useCallback(async (nodeId: string): Promise<void> => {
    try {
      await deleteNodeApi(nodeId);
      
      // Remove the deleted node from expanded nodes set
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(nodeId);
        return newSet;
      });
      
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

  // Refresh without losing expanded state
  const refreshTree = useCallback(async () => {
    await loadTree();
  }, [loadTree]);

  useEffect(() => {
    loadTree();
  }, [loadTree]); // Fixed: Added loadTree to dependency array

  return {
    tree,
    loading,
    error,
    addNode,
    editNode,
    deleteNode,
    refreshTree,
    toggleNode,
    expandedNodes
  };
};