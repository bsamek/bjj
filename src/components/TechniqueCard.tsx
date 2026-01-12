import { useState } from 'react';
import type { Technique } from '../types';
import { EditableItem } from './EditableItem';

interface TechniqueCardProps {
  technique: Technique;
  onAddNote: (techniqueId: string, note: string) => void;
  onUpdateTechnique: (techniqueId: string, updates: Partial<Technique>) => void;
  onDeleteTechnique: (techniqueId: string) => void;
  onUpdateNote: (techniqueId: string, index: number, note: string) => void;
  onDeleteNote: (techniqueId: string, index: number) => void;
}

export function TechniqueCard({
  technique,
  onAddNote,
  onUpdateTechnique,
  onDeleteTechnique,
  onUpdateNote,
  onDeleteNote,
}: TechniqueCardProps) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [editedTechnique, setEditedTechnique] = useState({
    name: technique.name,
    description: technique.description,
  });

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(technique.id, newNote.trim());
      setNewNote('');
      setIsAddingNote(false);
    }
  };

  const handleSaveEdit = () => {
    if (editedTechnique.name.trim()) {
      onUpdateTechnique(technique.id, {
        name: editedTechnique.name.trim(),
        description: editedTechnique.description.trim(),
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTechnique({
      name: technique.name,
      description: technique.description,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDeleteTechnique(technique.id);
    setIsConfirmingDelete(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        <div className="space-y-2">
          <input
            type="text"
            value={editedTechnique.name}
            onChange={(e) => setEditedTechnique({ ...editedTechnique, name: e.target.value })}
            placeholder="Technique name"
            className="w-full px-3 py-2 border border-slate-300 rounded"
            autoFocus
          />
          <input
            type="text"
            value={editedTechnique.description}
            onChange={(e) => setEditedTechnique({ ...editedTechnique, description: e.target.value })}
            placeholder="Description"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1 text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isConfirmingDelete) {
    return (
      <div className="bg-white border border-red-200 rounded-lg p-4 shadow-sm">
        <p className="text-slate-700 mb-3">Delete "{technique.name}"?</p>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={() => setIsConfirmingDelete(false)}
            className="px-3 py-1 text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-800">{technique.name}</h4>
          <p className="text-slate-600 text-sm mt-1">{technique.description}</p>
        </div>
        <div className="flex gap-2 ml-2">
          <button
            onClick={() => setIsAddingNote(true)}
            className="text-slate-400 hover:text-blue-600 text-sm"
            title="Add note"
          >
            + Note
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="text-slate-400 hover:text-blue-600 text-sm"
            title="Edit technique"
          >
            Edit
          </button>
          <button
            onClick={() => setIsConfirmingDelete(true)}
            className="text-slate-400 hover:text-red-600 text-sm"
            title="Delete technique"
          >
            Delete
          </button>
        </div>
      </div>

      {technique.notes.length > 0 && (
        <ul className="mt-3 space-y-1">
          {technique.notes.map((note, idx) => (
            <EditableItem
              key={idx}
              value={note}
              borderStyle
              onUpdate={(newValue) => onUpdateNote(technique.id, idx, newValue)}
              onDelete={() => onDeleteNote(technique.id, idx)}
            />
          ))}
        </ul>
      )}

      {isAddingNote && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddNote();
              if (e.key === 'Escape') setIsAddingNote(false);
            }}
          />
          <button
            onClick={handleAddNote}
            className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
          <button
            onClick={() => setIsAddingNote(false)}
            className="px-2 py-1 text-sm text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
