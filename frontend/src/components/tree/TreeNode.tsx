// import React, { useState } from 'react';
// import { ChevronRight, ChevronDown, Edit2, Trash2 } from 'lucide-react';
// import { type ITreeNode } from '../../types/interface/nodeInterface';
// import AddNodeForm from './AddNodeForm';
// import ConfirmDialog from '../common/ConfirmDialog';

// interface TreeNodeProps {
//   node: ITreeNode;
//   onAddChild: (parentId: string, name: string) => Promise<void>;
//   onEdit: (nodeId: string, name: string) => Promise<void>;
//   onDelete: (nodeId: string) => Promise<void>;
//   level?: number;
// }

// const TreeNode: React.FC<TreeNodeProps> = ({ 
//   node, 
//   onAddChild, 
//   onEdit, 
//   onDelete, 
//   level = 0 
// }) => {
//   const [isExpanded, setIsExpanded] = useState<boolean>(false);
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [editName, setEditName] = useState<string>(node.name);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const handleToggle = (): void => setIsExpanded(!isExpanded);

//   const handleEdit = async (e: React.FormEvent): Promise<void> => {
//     e.preventDefault();
//     if (!editName.trim() || editName === node.name) {
//       setIsEditing(false);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       await onEdit(node.id, editName.trim());
//       setIsEditing(false);
//     } catch (error) {
//       console.error('Failed to edit node:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async (): Promise<void> => {
//     setIsLoading(true);
//     try {
//       await onDelete(node.id);
//       setShowDeleteConfirm(false);
//     } catch (error) {
//       console.error('Failed to delete node:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAddChild = async (name: string): Promise<void> => {
//     // parentId is not needed here because we already know it's node.id
//     await onAddChild(node.id, name);
//     setIsExpanded(true);
//   };

//   return (
//     <div className="relative">
//       <div 
//         className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-lg group transition"
//         style={{ marginLeft: `${level * 24}px` }}
//       >
//         {/* Expand/Collapse Button */}
//         {node.children && node.children.length > 0 && (
//           <button
//             onClick={handleToggle}
//             className="p-1 hover:bg-gray-200 rounded transition"
//             aria-label={isExpanded ? 'Collapse' : 'Expand'}
//           >
//             {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//           </button>
//         )}
        
//         {!node.children?.length && <div className="w-6" />}

//         {/* Node Content */}
//         {isEditing ? (
//           <form onSubmit={handleEdit} className="flex-1 flex items-center gap-2">
//             <input
//               type="text"
//               value={editName}
//               onChange={(e) => setEditName(e.target.value)}
//               className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
//               autoFocus
//               disabled={isLoading}
//             />
//             <button
//               type="submit"
//               disabled={isLoading || !editName.trim()}
//               className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 disabled:opacity-50"
//             >
//               Save
//             </button>
//             <button
//               type="button"
//               onClick={() => {
//                 setIsEditing(false);
//                 setEditName(node.name);
//               }}
//               className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </form>
//         ) : (
//           <>
//             <span 
//               className="flex-1 font-medium text-gray-800 cursor-pointer hover:text-emerald-600"
//               onClick={() => setIsEditing(true)}
//             >
//               {node.name}
//             </span>
            
//             {/* Action Buttons */}
//             <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="p-1 text-blue-600 hover:bg-blue-50 rounded"
//                 title="Edit"
//                 aria-label="Edit node"
//               >
//                 <Edit2 size={14} />
//               </button>
//               <button
//                 onClick={() => setShowDeleteConfirm(true)}
//                 className="p-1 text-red-600 hover:bg-red-50 rounded"
//                 title="Delete"
//                 aria-label="Delete node"
//               >
//                 <Trash2 size={14} />
//               </button>
//               <AddNodeForm 
//                 parentId={node.id}
//                 onAdd={handleAddChild}
//               />
//             </div>
//           </>
//         )}
//       </div>

//       {/* Children */}
//       {isExpanded && node.children && node.children.length > 0 && (
//         <div>
//           {node.children.map((child) => (
//             <TreeNode
//               key={child.id}
//               node={child}
//               onAddChild={onAddChild}
//               onEdit={onEdit}
//               onDelete={onDelete}
//               level={level + 1}
//             />
//           ))}
//         </div>
//       )}

//       {/* Delete Confirmation Dialog */}
//       <ConfirmDialog
//         isOpen={showDeleteConfirm}
//         title="Delete Node"
//         message={`Are you sure you want to delete "${node.name}" and all its children? This action cannot be undone.`}
//         onConfirm={handleDelete}
//         onCancel={() => setShowDeleteConfirm(false)}
//       />
//     </div>
//   );
// };

// export default TreeNode;








































































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
  onToggle?: (nodeId: string) => void; // Add this prop
  level?: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ 
  node, 
  onAddChild, 
  onEdit, 
  onDelete,
  onToggle, // Receive the toggle function
  level = 0 
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(node.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleToggle = (): void => {
    if (onToggle) {
      onToggle(node.id);
    }
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
    // Parent will auto-expand via the hook
  };

  return (
    <div className="relative">
      <div 
        className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-lg group transition"
        style={{ marginLeft: `${level * 24}px` }}
      >
        {/* Expand/Collapse Button */}
        {node.children && node.children.length > 0 && (
          <button
            onClick={handleToggle}
            className="p-1 hover:bg-gray-200 rounded transition"
            aria-label={node.isExpanded ? 'Collapse' : 'Expand'}
          >
            {node.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
        
        {!node.children?.length && <div className="w-6" />}

        {/* Node Content */}
        {isEditing ? (
          <form onSubmit={handleEdit} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !editName.trim()}
              className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditName(node.name);
              }}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <span 
              className="flex-1 font-medium text-gray-800 cursor-pointer hover:text-emerald-600"
              onClick={() => setIsEditing(true)}
            >
              {node.name}
            </span>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                title="Edit"
                aria-label="Edit node"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="Delete"
                aria-label="Delete node"
              >
                <Trash2 size={14} />
              </button>
              <AddNodeForm 
                parentId={node.id}
                onAdd={handleAddChild}
              />
            </div>
          </>
        )}
      </div>

      {/* Children */}
      {node.isExpanded && node.children && node.children.length > 0 && (
        <div>
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

      {/* Delete Confirmation Dialog */}
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