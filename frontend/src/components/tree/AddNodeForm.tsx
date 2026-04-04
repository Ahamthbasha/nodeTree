import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AddNodeFormProps {
  parentId?: string | null;
  onAdd: (name: string, parentId?: string | null) => Promise<void>;
  onCancel?: () => void;
  isRoot?: boolean;
}

const AddNodeForm: React.FC<AddNodeFormProps> = ({
  parentId,
  onAdd,
  onCancel,
  isRoot = false,
}) => {
  const [nodeName, setNodeName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeName.trim()) return;
    setIsAdding(true);
    try {
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
        title={isRoot ? undefined : 'Add child node'}
        aria-label={isRoot ? 'Add Root Node' : 'Add child node'}
        className={`flex items-center gap-1 transition font-medium ${
          isRoot
            ? 'bg-emerald-600 text-white text-sm px-3 sm:px-4 py-2 rounded-lg hover:bg-emerald-700 shadow-sm'
            : 'p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg'
        }`}
      >
        <Plus size={isRoot ? 15 : 13} />
        {isRoot && <span className="hidden sm:inline">Add Root Node</span>}
        {isRoot && <span className="sm:hidden">Add</span>}
      </button>
    );
  }

  return (
    <div className="mt-1 w-full">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder={isRoot ? 'Root node name…' : 'Child name…'}
            className="flex-1 min-w-0 px-2.5 py-1.5 text-sm border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            autoFocus
            disabled={isAdding}
          />
          <button
            type="submit"
            disabled={isAdding || !nodeName.trim()}
            className="flex-shrink-0 px-2.5 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition whitespace-nowrap"
          >
            {isAdding ? '…' : 'Add'}
          </button>
          <button
            type="button"
            onClick={() => { setShowForm(false); onCancel?.(); }}
            className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            aria-label="Cancel"
          >
            <X size={15} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNodeForm;