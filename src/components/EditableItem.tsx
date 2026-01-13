import { useState, useRef, useEffect } from 'react';

interface EditableItemProps {
  value: string;
  onUpdate: (newValue: string) => void;
  onDelete: () => void;
  bulletColor?: string;
  bulletChar?: string;
  borderStyle?: boolean;
}

export function EditableItem({
  value,
  onUpdate,
  onDelete,
  bulletColor = 'text-blue-500',
  bulletChar = '•',
  borderStyle = false,
}: EditableItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() && editValue.trim() !== value) {
      onUpdate(editValue.trim());
    }
    setIsEditing(false);
    setEditValue(value);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  const handleDelete = () => {
    onDelete();
    setIsConfirmingDelete(false);
  };

  if (isEditing) {
    return (
      <div className="flex gap-2 items-center">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded"
        />
        <button
          onClick={handleSave}
          className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="px-2 py-1 text-sm text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (isConfirmingDelete) {
    return (
      <li className="flex items-center gap-2 text-slate-700 border border-red-200 rounded px-2 py-1 bg-red-50">
        <span className="flex-1 text-sm">Delete this item?</span>
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
        <button
          onClick={() => setIsConfirmingDelete(false)}
          className="px-2 py-1 text-sm text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>
      </li>
    );
  }

  if (borderStyle) {
    return (
      <li className="text-slate-700 pl-3 border-l-2 border-slate-300 group flex items-start justify-between">
        <span className="flex-1">{value}</span>
        <span className="hover-action flex gap-1 ml-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-slate-400 hover:text-blue-600 text-xs"
            title="Edit"
          >
            Edit
          </button>
          <button
            onClick={() => setIsConfirmingDelete(true)}
            className="text-slate-400 hover:text-red-600 text-xs"
            title="Delete"
          >
            Delete
          </button>
        </span>
      </li>
    );
  }

  return (
    <li className="text-slate-700 flex items-start group">
      <span className={`${bulletColor} mr-2`}>{bulletChar}</span>
      <span className="flex-1">{value}</span>
      <span className="hover-action flex gap-1 ml-2">
        <button
          onClick={() => setIsEditing(true)}
          className="text-slate-400 hover:text-blue-600 text-xs"
          title="Edit"
        >
          Edit
        </button>
        <button
          onClick={() => setIsConfirmingDelete(true)}
          className="text-slate-400 hover:text-red-600 text-xs"
          title="Delete"
        >
          Delete
        </button>
      </span>
    </li>
  );
}
