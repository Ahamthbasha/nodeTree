import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { type ITreeNode } from '../../types/interface/nodeInterface';
import AddNodeForm from './AddNodeForm';
import ConfirmDialog from '../common/ConfirmDialog';

interface TreeNodeProps {
  node: ITreeNode;
  onAddChild: (parentId: string, name: string) => Promise<void>;
  onEdit: (nodeId: string, name: string) => Promise<void>;
  onDelete: (nodeId: string) => Promise<void>;
  onToggle?: (nodeId: string) => void;
  level?: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  onAddChild,
  onEdit,
  onDelete,
  onToggle,
  level = 0,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(node.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleToggle = (): void => {
    if (onToggle) onToggle(node.id);
  };

  const handleEdit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!editName.trim() || editName === node.name) {
      setIsEditing(false);
      return;
    }
    setIsLoading(true);
    try {
      await onEdit(node.id, editName.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to edit node:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await onDelete(node.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete node:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddChild = async (name: string): Promise<void> => {
    await onAddChild(node.id, name);
  };

  // Cap indentation on small screens to prevent overflow
  const indentPx = Math.min(level * 20, 100);

  return (
    <div className="relative">
      <div
        className="flex items-center gap-1 sm:gap-2 py-2 px-2 sm:px-3 hover:bg-emerald-50 rounded-lg group transition-colors duration-150"
        style={{ marginLeft: `${indentPx}px` }}
      >
        {/* Expand/Collapse */}
        {node.children && node.children.length > 0 ? (
          <button
            onClick={handleToggle}
            className="flex-shrink-0 p-1 hover:bg-emerald-100 rounded-md transition text-emerald-600"
            aria-label={node.isExpanded ? 'Collapse' : 'Expand'}
          >
            {node.isExpanded
              ? <ChevronDown size={15} />
              : <ChevronRight size={15} />}
          </button>
        ) : (
          <div className="w-6 flex-shrink-0" />
        )}

        {/* Node Content */}
        {isEditing ? (
          <form onSubmit={handleEdit} className="flex-1 flex flex-wrap items-center gap-1.5 min-w-0">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 min-w-0 px-2 py-1 text-sm border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
              disabled={isLoading}
            />
            <div className="flex gap-1 flex-shrink-0">
              <button
                type="submit"
                disabled={isLoading || !editName.trim()}
                className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 disabled:opacity-50 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => { setIsEditing(false); setEditName(node.name); }}
                className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <span
              className="flex-1 min-w-0 font-medium text-sm sm:text-base text-gray-800 truncate cursor-pointer hover:text-emerald-700 transition-colors"
              onClick={() => setIsEditing(true)}
              title={node.name}
            >
              {node.name}
            </span>

            {/*
              KEY FIX: On mobile/touch screens hover never fires, so opacity-0 buttons
              stay invisible forever. Solution:
              - Mobile (< sm): buttons always visible
              - Desktop (≥ sm): hidden by default, revealed on group-hover
              Tailwind: omit opacity on base, apply sm:opacity-0 + sm:group-hover:opacity-100
            */}
            <div className="flex items-center gap-0.5 flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Edit"
                aria-label="Edit node"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                title="Delete"
                aria-label="Delete node"
              >
                <Trash2 size={13} />
              </button>
              <AddNodeForm parentId={node.id} onAdd={handleAddChild} />
            </div>
          </>
        )}
      </div>

      {/* Children with visual connector line */}
      {node.isExpanded && node.children && node.children.length > 0 && (
        <div className="border-l-2 border-emerald-100 ml-3 sm:ml-4 pl-0">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
              level={level + 1}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Node"
        message={`Are you sure you want to delete "${node.name}" and all its children? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

export default TreeNode;