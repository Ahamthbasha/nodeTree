import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LogOut, GitBranch, RefreshCw } from 'lucide-react';
import { useNodeTree } from '../../../hooks/useNodeTree';
import TreeNode from '../../../components/tree/TreeNode';
import AddNodeForm from '../../../components/tree/AddNodeForm';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { clearUserDetails } from '../../../redux/slices/userSlice';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    tree,
    loading,
    error,
    addNode,
    editNode,
    deleteNode,
    toggleNode,
    refreshTree,
  } = useNodeTree();

  const handleLogout = (): void => {
    dispatch(clearUserDetails());
    localStorage.removeItem('user');
    navigate('/user/login');
  };

  const handleAddRootNode = async (name: string): Promise<void> => {
    await addNode(name, null);
  };
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900">
        <LoadingSpinner size="lg" />
        <p className="text-emerald-200 text-sm animate-pulse">Loading your tree…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/30">

      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center gap-3">

            {/* Brand */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex-shrink-0 p-1.5 sm:p-2 bg-emerald-100 rounded-lg">
                <GitBranch className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate leading-tight">
                  Node Tree Manager
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">
                  Manage your hierarchical data
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <button
                onClick={refreshTree}
                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                title="Refresh"
                aria-label="Refresh tree"
              >
                <RefreshCw size={15} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 overflow-hidden">

          {/* Panel Header */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Your Node Tree
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Tap a name to edit · arrows to expand · + to add children
                </p>
              </div>
              <div className="flex-shrink-0">
                <AddNodeForm onAdd={handleAddRootNode} isRoot />
              </div>
            </div>
          </div>

          {/* Tree Body */}
          <div className="p-3 sm:p-5 overflow-x-auto">
            {error ? (
              <div className="text-center py-10 sm:py-16 px-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-red-500 font-bold text-lg">!</span>
                </div>
                <p className="text-red-500 text-sm sm:text-base mb-4">{error}</p>
                <button
                  onClick={refreshTree}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition"
                >
                  Try Again
                </button>
              </div>
            ) : tree.length === 0 ? (
              <div className="text-center py-10 sm:py-16 px-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <GitBranch className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  No nodes yet
                </h3>
                <p className="text-sm text-gray-400 mb-5">
                  Start by creating your first root node
                </p>
                <AddNodeForm onAdd={handleAddRootNode} isRoot />
              </div>
            ) : (
              <div className="space-y-0.5 min-w-0">
                {tree.map((node) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    onAddChild={handleAddChild}
                    onEdit={handleEditNode}
                    onDelete={handleDeleteNode}
                    onToggle={toggleNode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400 px-4">
          💡 Tap any node name to rename it inline · nodes can be nested infinitely
        </p>
      </main>
    </div>
  );
};

export default Dashboard;