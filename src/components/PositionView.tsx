import { useState } from 'react';
import { Position, Technique } from '../types';
import { TechniqueCard } from './TechniqueCard';

interface PositionViewProps {
  position: Position;
  onAddTechnique: (positionId: string, perspective: 'top' | 'bottom', technique: Omit<Technique, 'id'>) => void;
  onAddTechniqueNote: (positionId: string, perspective: 'top' | 'bottom', techniqueId: string, note: string) => void;
  onAddPerspectiveNote: (positionId: string, perspective: 'top' | 'bottom', note: string) => void;
}

export function PositionView({
  position,
  onAddTechnique,
  onAddTechniqueNote,
  onAddPerspectiveNote,
}: PositionViewProps) {
  const [activeTab, setActiveTab] = useState<'top' | 'bottom'>('top');
  const [isAddingTechnique, setIsAddingTechnique] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newTechnique, setNewTechnique] = useState({ name: '', description: '' });
  const [newNote, setNewNote] = useState('');

  const perspective = position[activeTab];

  const handleAddTechnique = () => {
    if (newTechnique.name.trim()) {
      onAddTechnique(position.id, activeTab, {
        name: newTechnique.name.trim(),
        description: newTechnique.description.trim(),
        notes: [],
      });
      setNewTechnique({ name: '', description: '' });
      setIsAddingTechnique(false);
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddPerspectiveNote(position.id, activeTab, newNote.trim());
      setNewNote('');
      setIsAddingNote(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">{position.name}</h2>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('top')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'top'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Top
        </button>
        <button
          onClick={() => setActiveTab('bottom')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'bottom'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Bottom
        </button>
      </div>

      {/* Do First */}
      {perspective.doFirst.length > 0 && (
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Do First
          </h3>
          <ul className="space-y-1">
            {perspective.doFirst.map((item, idx) => (
              <li key={idx} className="text-slate-700 flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Techniques */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Techniques
          </h3>
          <button
            onClick={() => setIsAddingTechnique(true)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Technique
          </button>
        </div>

        {isAddingTechnique && (
          <div className="bg-slate-50 p-4 rounded-lg mb-4 space-y-2">
            <input
              type="text"
              value={newTechnique.name}
              onChange={(e) => setNewTechnique({ ...newTechnique, name: e.target.value })}
              placeholder="Technique name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
              autoFocus
            />
            <input
              type="text"
              value={newTechnique.description}
              onChange={(e) => setNewTechnique({ ...newTechnique, description: e.target.value })}
              placeholder="Description"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddTechnique}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
              <button
                onClick={() => setIsAddingTechnique(false)}
                className="px-3 py-1 text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {perspective.techniques.map((technique) => (
            <TechniqueCard
              key={technique.id}
              technique={technique}
              onAddNote={(techniqueId, note) =>
                onAddTechniqueNote(position.id, activeTab, techniqueId, note)
              }
            />
          ))}
        </div>
      </section>

      {/* Transitions */}
      {perspective.transitions.length > 0 && (
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Transitions
          </h3>
          <ul className="space-y-1">
            {perspective.transitions.map((item, idx) => (
              <li key={idx} className="text-slate-700 flex items-start">
                <span className="text-green-500 mr-2">→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Notes */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Notes
          </h3>
          <button
            onClick={() => setIsAddingNote(true)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Note
          </button>
        </div>

        {isAddingNote && (
          <div className="bg-slate-50 p-4 rounded-lg mb-4">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              className="w-full px-3 py-2 border border-slate-300 rounded mb-2"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddNote();
                if (e.key === 'Escape') setIsAddingNote(false);
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddNote}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
              <button
                onClick={() => setIsAddingNote(false)}
                className="px-3 py-1 text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {perspective.notes.length > 0 ? (
          <ul className="space-y-2">
            {perspective.notes.map((note, idx) => (
              <li key={idx} className="text-slate-700 pl-3 border-l-2 border-slate-300">
                {note}
              </li>
            ))}
          </ul>
        ) : (
          !isAddingNote && (
            <p className="text-slate-400 text-sm italic">No notes yet</p>
          )
        )}
      </section>
    </div>
  );
}
