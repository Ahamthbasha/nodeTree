import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LogOut, GitBranch } from 'lucide-react';
import { useNodeTree } from '../../../hooks/useNodeTree'; 
import TreeNode from '../../../components/tree/TreeNode'; 
import AddNodeForm from '../../../components/tree/AddNodeForm'; 
import LoadingSpinner from '../../../components/common/LoadingSpinner'; 
import { clearUserDetails } from '../../../redux/slices/userSlice'; 

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tree, loading, error, addNode, editNode, deleteNode } = useNodeTree();

  const handleLogout = (): void => {
    dispatch(clearUserDetails());
    localStorage.removeItem('user');
    // Navigate to login page - since UserRouter is mounted at /user/*
    navigate('/user/login');
  };

  const handleAddRootNode = async (name: string): Promise<void> => {
    await addNode(name, null);
  };

  // Wrapper functions to match TreeNode component expectations
  const handleAddChild = async (parentId: string, name: string): Promise<void> => {
    await addNode(name, parentId);
  };

  const handleEditNode = async (nodeId: string, name: string): Promise<void> => {
    await editNode(nodeId, name);
  };

  const handleDeleteNode = async (nodeId: string): Promise<void> => {
    await deleteNode(nodeId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <GitBranch className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Node Tree Manager</h1>
                <p className="text-sm text-gray-600">Manage your hierarchical data structure with ease</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Node Tree</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Click node names to edit • Use expand/collapse buttons to navigate • Add children with the + button
                </p>
              </div>
              <AddNodeForm onAdd={handleAddRootNode} isRoot />
            </div>
          </div>

          <div className="p-6">
            {error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Retry
                </button>
              </div>
            ) : tree.length === 0 ? (
              <div className="text-center py-12">
                <GitBranch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No nodes yet</h3>
                <p className="text-gray-600 mb-4">Start by creating your first root node</p>
                <AddNodeForm onAdd={handleAddRootNode} isRoot />
              </div>
            ) : (
              <div className="space-y-1">
                {tree.map((node) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    onAddChild={handleAddChild}
                    onEdit={handleEditNode}
                    onDelete={handleDeleteNode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>💡 Tip: You can create infinitely nested nodes. Click on any node name to edit it.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;