import { useState } from 'react';
import type { Position } from '../types';
import type { ArrayHandlers, TechniqueHandlers } from '../utils/stateHandlers';
import { TechniqueCard } from './TechniqueCard';
import { EditableItem } from './EditableItem';
import { Button } from './ui/Button';
import { AddItemForm } from './ui/AddItemForm';

type AddingSection = 'technique' | 'note' | 'doFirst' | 'transition' | null;

interface PositionViewProps {
  position: Position;
  doFirstHandlers: ArrayHandlers;
  transitionHandlers: ArrayHandlers;
  noteHandlers: ArrayHandlers;
  techniqueHandlers: TechniqueHandlers;
}

export function PositionView({
  position,
  doFirstHandlers,
  transitionHandlers,
  noteHandlers,
  techniqueHandlers,
}: PositionViewProps) {
  const [activeTab, setActiveTab] = useState<'top' | 'bottom'>('top');
  const [addingSection, setAddingSection] = useState<AddingSection>(null);
  const [newTechnique, setNewTechnique] = useState({ name: '', description: '' });

  const perspective = position[activeTab];

  const handleAddTechnique = () => {
    if (newTechnique.name.trim()) {
      techniqueHandlers.add(position.id, activeTab, {
        name: newTechnique.name.trim(),
        description: newTechnique.description.trim(),
        notes: [],
      });
      setNewTechnique({ name: '', description: '' });
      setAddingSection(null);
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
          <Button variant="link" onClick={() => setAddingSection('doFirst')}>
            + Add
          </Button>
        </div>

        {addingSection === 'doFirst' && (
          <AddItemForm
            placeholder="Add a do first item..."
            onAdd={(value) => {
              doFirstHandlers.add(position.id, activeTab, value);
              setAddingSection(null);
            }}
            onCancel={() => setAddingSection(null)}
          />
        )}

        {perspective.doFirst.length > 0 ? (
          <ul className="space-y-1">
            {perspective.doFirst.map((item, idx) => (
              <EditableItem
                key={idx}
                value={item}
                bulletColor="text-blue-500"
                bulletChar="•"
                onUpdate={(newValue) => doFirstHandlers.update(position.id, activeTab, idx, newValue)}
                onDelete={() => doFirstHandlers.delete(position.id, activeTab, idx)}
              />
            ))}
          </ul>
        ) : (
          addingSection !== 'doFirst' && (
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
          <Button variant="link" onClick={() => setAddingSection('technique')}>
            + Add Technique
          </Button>
        </div>

        {addingSection === 'technique' && (
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
              <Button onClick={handleAddTechnique}>Add</Button>
              <Button variant="secondary" onClick={() => setAddingSection(null)}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {perspective.techniques.map((technique) => (
            <TechniqueCard
              key={technique.id}
              technique={technique}
              onAddNote={(techniqueId, note) =>
                techniqueHandlers.addNote(position.id, activeTab, techniqueId, note)
              }
              onUpdateTechnique={(techniqueId, updates) =>
                techniqueHandlers.update(position.id, activeTab, techniqueId, updates)
              }
              onDeleteTechnique={(techniqueId) =>
                techniqueHandlers.delete(position.id, activeTab, techniqueId)
              }
              onUpdateNote={(techniqueId, index, note) =>
                techniqueHandlers.updateNote(position.id, activeTab, techniqueId, index, note)
              }
              onDeleteNote={(techniqueId, index) =>
                techniqueHandlers.deleteNote(position.id, activeTab, techniqueId, index)
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
          <Button variant="link" onClick={() => setAddingSection('transition')}>
            + Add
          </Button>
        </div>

        {addingSection === 'transition' && (
          <AddItemForm
            placeholder="Add a transition..."
            onAdd={(value) => {
              transitionHandlers.add(position.id, activeTab, value);
              setAddingSection(null);
            }}
            onCancel={() => setAddingSection(null)}
          />
        )}

        {perspective.transitions.length > 0 ? (
          <ul className="space-y-1">
            {perspective.transitions.map((item, idx) => (
              <EditableItem
                key={idx}
                value={item}
                bulletColor="text-green-500"
                bulletChar="→"
                onUpdate={(newValue) => transitionHandlers.update(position.id, activeTab, idx, newValue)}
                onDelete={() => transitionHandlers.delete(position.id, activeTab, idx)}
              />
            ))}
          </ul>
        ) : (
          addingSection !== 'transition' && (
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
          <Button variant="link" onClick={() => setAddingSection('note')}>
            + Add Note
          </Button>
        </div>

        {addingSection === 'note' && (
          <AddItemForm
            placeholder="Add a note..."
            onAdd={(value) => {
              noteHandlers.add(position.id, activeTab, value);
              setAddingSection(null);
            }}
            onCancel={() => setAddingSection(null)}
          />
        )}

        {perspective.notes.length > 0 ? (
          <ul className="space-y-2">
            {perspective.notes.map((note, idx) => (
              <EditableItem
                key={idx}
                value={note}
                borderStyle
                onUpdate={(newValue) => noteHandlers.update(position.id, activeTab, idx, newValue)}
                onDelete={() => noteHandlers.delete(position.id, activeTab, idx)}
              />
            ))}
          </ul>
        ) : (
          addingSection !== 'note' && (
            <p className="text-slate-400 text-sm italic">No notes yet</p>
          )
        )}
      </section>
    </div>
  );
}
