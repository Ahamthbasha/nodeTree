import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AddNodeFormProps {
  parentId?: string | null; // Keep for future use or pass to onAdd if needed
  onAdd: (name: string, parentId?: string | null) => Promise<void>;
  onCancel?: () => void;
  isRoot?: boolean;
}

const AddNodeForm: React.FC<AddNodeFormProps> = ({ 
  parentId, 
  onAdd, 
  onCancel, 
  isRoot = false 
}) => {
  const [nodeName, setNodeName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeName.trim()) return;

    setIsAdding(true);
    try {
      // Pass parentId to onAdd if needed
      await onAdd(nodeName.trim(), parentId);
      setNodeName('');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add node:', error);
    } finally {
      setIsAdding(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className={`flex items-center gap-1 text-sm ${
          isRoot 
            ? 'bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700'
            : 'text-emerald-600 hover:text-emerald-700'
        } transition`}
      >
        <Plus size={16} />
        {isRoot ? 'Add Root Node' : 'Add Child'}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          placeholder="Enter node name..."
          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          autoFocus
          disabled={isAdding}
        />
        <button
          type="submit"
          disabled={isAdding || !nodeName.trim()}
          className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
        >
          {isAdding ? 'Adding...' : 'Add'}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowForm(false);
            onCancel?.();
          }}
          className="p-1.5 text-gray-500 hover:text-gray-700 transition"
        >
          <X size={18} />
        </button>
      </div>
    </form>
  );
};

export default AddNodeForm;