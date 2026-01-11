import { useState } from 'react';
import type { Technique } from '../types';

interface TechniqueCardProps {
  technique: Technique;
  onAddNote: (techniqueId: string, note: string) => void;
}

export function TechniqueCard({ technique, onAddNote }: TechniqueCardProps) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(technique.id, newNote.trim());
      setNewNote('');
      setIsAddingNote(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-slate-800">{technique.name}</h4>
          <p className="text-slate-600 text-sm mt-1">{technique.description}</p>
        </div>
        <button
          onClick={() => setIsAddingNote(true)}
          className="text-slate-400 hover:text-blue-600 text-sm"
          title="Add note"
        >
          + Note
        </button>
      </div>

      {technique.notes.length > 0 && (
        <div className="mt-3 space-y-1">
          {technique.notes.map((note, idx) => (
            <p key={idx} className="text-sm text-slate-700 pl-3 border-l-2 border-blue-300">
              {note}
            </p>
          ))}
        </div>
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
