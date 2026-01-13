import { useState } from 'react';
import type { Principle } from '../types';

interface PrinciplesViewProps {
  principles: Principle[];
  onAddPrinciple: (principle: Omit<Principle, 'id'>) => void;
  onUpdatePrinciple: (principleId: string, updates: Partial<Principle>) => void;
  onDeletePrinciple: (principleId: string) => void;
}

interface PrincipleItemProps {
  principle: Principle;
  color: string;
  onUpdate: (principleId: string, updates: Partial<Principle>) => void;
  onDelete: (principleId: string) => void;
}

function PrincipleItem({ principle, color, onUpdate, onDelete }: PrincipleItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [editedContent, setEditedContent] = useState(principle.content);
  const [editedCategory, setEditedCategory] = useState<'universal' | 'top' | 'bottom'>(
    principle.category || 'universal'
  );

  const handleSave = () => {
    if (editedContent.trim()) {
      onUpdate(principle.id, {
        content: editedContent.trim(),
        category: editedCategory,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedContent(principle.content);
    setEditedCategory(principle.category || 'universal');
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(principle.id);
    setIsConfirmingDelete(false);
  };

  if (isEditing) {
    return (
      <li className="bg-slate-50 p-3 rounded-lg space-y-2">
        <input
          type="text"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded"
          autoFocus
        />
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name={`category-${principle.id}`}
              checked={editedCategory === 'universal'}
              onChange={() => setEditedCategory('universal')}
            />
            Universal
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name={`category-${principle.id}`}
              checked={editedCategory === 'top'}
              onChange={() => setEditedCategory('top')}
            />
            Top
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name={`category-${principle.id}`}
              checked={editedCategory === 'bottom'}
              onChange={() => setEditedCategory('bottom')}
            />
            Bottom
          </label>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
        </div>
      </li>
    );
  }

  if (isConfirmingDelete) {
    return (
      <li className="flex items-center gap-2 border border-red-200 rounded px-3 py-2 bg-red-50">
        <span className="text-slate-700 flex-1">Delete this principle?</span>
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

  return (
    <li className="flex items-start group">
      <span className={`${color} mr-2`}>•</span>
      <span className="text-slate-700 flex-1">{principle.content}</span>
      <span className="opacity-0 group-hover:opacity-100 flex gap-1 ml-2">
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

function PrincipleList({
  items,
  color,
  onUpdate,
  onDelete,
}: {
  items: Principle[];
  color: string;
  onUpdate: (principleId: string, updates: Partial<Principle>) => void;
  onDelete: (principleId: string) => void;
}) {
  return (
    <ul className="space-y-2">
      {items.map((principle) => (
        <PrincipleItem
          key={principle.id}
          principle={principle}
          color={color}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export function PrinciplesView({
  principles,
  onAddPrinciple,
  onUpdatePrinciple,
  onDeletePrinciple,
}: PrinciplesViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newPrinciple, setNewPrinciple] = useState<{ content: string; category: 'universal' | 'top' | 'bottom' }>({ content: '', category: 'universal' });

  const handleAdd = () => {
    if (newPrinciple.content.trim()) {
      onAddPrinciple({
        content: newPrinciple.content.trim(),
        category: newPrinciple.category,
      });
      setNewPrinciple({ content: '', category: 'universal' });
      setIsAdding(false);
    }
  };

  const universalPrinciples = principles.filter((p) => p.category === 'universal' || !p.category);
  const topPrinciples = principles.filter((p) => p.category === 'top');
  const bottomPrinciples = principles.filter((p) => p.category === 'bottom');

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Principles</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          + Add Principle
        </button>
      </div>

      {isAdding && (
        <div className="bg-slate-50 p-4 rounded-lg mb-6 space-y-2">
          <input
            type="text"
            value={newPrinciple.content}
            onChange={(e) => setNewPrinciple({ ...newPrinciple, content: e.target.value })}
            placeholder="Enter principle..."
            className="w-full px-3 py-2 border border-slate-300 rounded"
            autoFocus
          />
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="category"
                checked={newPrinciple.category === 'universal'}
                onChange={() => setNewPrinciple({ ...newPrinciple, category: 'universal' })}
              />
              Universal
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="category"
                checked={newPrinciple.category === 'top'}
                onChange={() => setNewPrinciple({ ...newPrinciple, category: 'top' })}
              />
              Top
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="category"
                checked={newPrinciple.category === 'bottom'}
                onChange={() => setNewPrinciple({ ...newPrinciple, category: 'bottom' })}
              />
              Bottom
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {universalPrinciples.length > 0 && (
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Universal
          </h3>
          <PrincipleList
            items={universalPrinciples}
            color="text-blue-500"
            onUpdate={onUpdatePrinciple}
            onDelete={onDeletePrinciple}
          />
        </section>
      )}

      {topPrinciples.length > 0 && (
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            When on Top
          </h3>
          <PrincipleList
            items={topPrinciples}
            color="text-green-500"
            onUpdate={onUpdatePrinciple}
            onDelete={onDeletePrinciple}
          />
        </section>
      )}

      {bottomPrinciples.length > 0 && (
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            When on Bottom
          </h3>
          <PrincipleList
            items={bottomPrinciples}
            color="text-orange-500"
            onUpdate={onUpdatePrinciple}
            onDelete={onDeletePrinciple}
          />
        </section>
      )}
    </div>
  );
}
