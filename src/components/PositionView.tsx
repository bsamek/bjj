import { useState } from 'react';
import type { Position, Technique } from '../types';
import { TechniqueCard } from './TechniqueCard';
import { EditableItem } from './EditableItem';

interface PositionViewProps {
  position: Position;
  onAddTechnique: (positionId: string, perspective: 'top' | 'bottom', technique: Omit<Technique, 'id'>) => void;
  onAddTechniqueNote: (positionId: string, perspective: 'top' | 'bottom', techniqueId: string, note: string) => void;
  onAddPerspectiveNote: (positionId: string, perspective: 'top' | 'bottom', note: string) => void;
  onAddDoFirst: (positionId: string, perspective: 'top' | 'bottom', item: string) => void;
  onUpdateDoFirst: (positionId: string, perspective: 'top' | 'bottom', index: number, item: string) => void;
  onDeleteDoFirst: (positionId: string, perspective: 'top' | 'bottom', index: number) => void;
  onAddTransition: (positionId: string, perspective: 'top' | 'bottom', item: string) => void;
  onUpdateTransition: (positionId: string, perspective: 'top' | 'bottom', index: number, item: string) => void;
  onDeleteTransition: (positionId: string, perspective: 'top' | 'bottom', index: number) => void;
  onUpdateTechnique: (positionId: string, perspective: 'top' | 'bottom', techniqueId: string, updates: Partial<Technique>) => void;
  onDeleteTechnique: (positionId: string, perspective: 'top' | 'bottom', techniqueId: string) => void;
  onUpdatePerspectiveNote: (positionId: string, perspective: 'top' | 'bottom', index: number, note: string) => void;
  onDeletePerspectiveNote: (positionId: string, perspective: 'top' | 'bottom', index: number) => void;
  onUpdateTechniqueNote: (positionId: string, perspective: 'top' | 'bottom', techniqueId: string, index: number, note: string) => void;
  onDeleteTechniqueNote: (positionId: string, perspective: 'top' | 'bottom', techniqueId: string, index: number) => void;
}

export function PositionView({
  position,
  onAddTechnique,
  onAddTechniqueNote,
  onAddPerspectiveNote,
  onAddDoFirst,
  onUpdateDoFirst,
  onDeleteDoFirst,
  onAddTransition,
  onUpdateTransition,
  onDeleteTransition,
  onUpdateTechnique,
  onDeleteTechnique,
  onUpdatePerspectiveNote,
  onDeletePerspectiveNote,
  onUpdateTechniqueNote,
  onDeleteTechniqueNote,
}: PositionViewProps) {
  const [activeTab, setActiveTab] = useState<'top' | 'bottom'>('top');
  const [isAddingTechnique, setIsAddingTechnique] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isAddingDoFirst, setIsAddingDoFirst] = useState(false);
  const [isAddingTransition, setIsAddingTransition] = useState(false);
  const [newTechnique, setNewTechnique] = useState({ name: '', description: '' });
  const [newNote, setNewNote] = useState('');
  const [newDoFirst, setNewDoFirst] = useState('');
  const [newTransition, setNewTransition] = useState('');

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

  const handleAddDoFirstItem = () => {
    if (newDoFirst.trim()) {
      onAddDoFirst(position.id, activeTab, newDoFirst.trim());
      setNewDoFirst('');
      setIsAddingDoFirst(false);
    }
  };

  const handleAddTransitionItem = () => {
    if (newTransition.trim()) {
      onAddTransition(position.id, activeTab, newTransition.trim());
      setNewTransition('');
      setIsAddingTransition(false);
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
      <section className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Do First
          </h3>
          <button
            onClick={() => setIsAddingDoFirst(true)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add
          </button>
        </div>

        {isAddingDoFirst && (
          <div className="bg-slate-50 p-4 rounded-lg mb-3">
            <input
              type="text"
              value={newDoFirst}
              onChange={(e) => setNewDoFirst(e.target.value)}
              placeholder="Add a do first item..."
              className="w-full px-3 py-2 border border-slate-300 rounded mb-2"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddDoFirstItem();
                if (e.key === 'Escape') setIsAddingDoFirst(false);
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddDoFirstItem}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
              <button
                onClick={() => setIsAddingDoFirst(false)}
                className="px-3 py-1 text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {perspective.doFirst.length > 0 ? (
          <ul className="space-y-1">
            {perspective.doFirst.map((item, idx) => (
              <EditableItem
                key={idx}
                value={item}
                bulletColor="text-blue-500"
                bulletChar="•"
                onUpdate={(newValue) => onUpdateDoFirst(position.id, activeTab, idx, newValue)}
                onDelete={() => onDeleteDoFirst(position.id, activeTab, idx)}
              />
            ))}
          </ul>
        ) : (
          !isAddingDoFirst && (
            <p className="text-slate-400 text-sm italic">No items yet</p>
          )
        )}
      </section>

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
              onUpdateTechnique={(techniqueId, updates) =>
                onUpdateTechnique(position.id, activeTab, techniqueId, updates)
              }
              onDeleteTechnique={(techniqueId) =>
                onDeleteTechnique(position.id, activeTab, techniqueId)
              }
              onUpdateNote={(techniqueId, index, note) =>
                onUpdateTechniqueNote(position.id, activeTab, techniqueId, index, note)
              }
              onDeleteNote={(techniqueId, index) =>
                onDeleteTechniqueNote(position.id, activeTab, techniqueId, index)
              }
            />
          ))}
        </div>
      </section>

      {/* Transitions */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Transitions
          </h3>
          <button
            onClick={() => setIsAddingTransition(true)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add
          </button>
        </div>

        {isAddingTransition && (
          <div className="bg-slate-50 p-4 rounded-lg mb-3">
            <input
              type="text"
              value={newTransition}
              onChange={(e) => setNewTransition(e.target.value)}
              placeholder="Add a transition..."
              className="w-full px-3 py-2 border border-slate-300 rounded mb-2"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTransitionItem();
                if (e.key === 'Escape') setIsAddingTransition(false);
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddTransitionItem}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
              <button
                onClick={() => setIsAddingTransition(false)}
                className="px-3 py-1 text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {perspective.transitions.length > 0 ? (
          <ul className="space-y-1">
            {perspective.transitions.map((item, idx) => (
              <EditableItem
                key={idx}
                value={item}
                bulletColor="text-green-500"
                bulletChar="→"
                onUpdate={(newValue) => onUpdateTransition(position.id, activeTab, idx, newValue)}
                onDelete={() => onDeleteTransition(position.id, activeTab, idx)}
              />
            ))}
          </ul>
        ) : (
          !isAddingTransition && (
            <p className="text-slate-400 text-sm italic">No transitions yet</p>
          )
        )}
      </section>

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
              <EditableItem
                key={idx}
                value={note}
                borderStyle
                onUpdate={(newValue) => onUpdatePerspectiveNote(position.id, activeTab, idx, newValue)}
                onDelete={() => onDeletePerspectiveNote(position.id, activeTab, idx)}
              />
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
