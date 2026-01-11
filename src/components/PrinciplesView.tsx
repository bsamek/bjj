import { useState } from 'react';
import { Principle } from '../types';

interface PrinciplesViewProps {
  principles: Principle[];
  onAddPrinciple: (principle: Omit<Principle, 'id'>) => void;
}

export function PrinciplesView({ principles, onAddPrinciple }: PrinciplesViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newPrinciple, setNewPrinciple] = useState({ content: '', category: 'universal' as const });

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

  const PrincipleList = ({ items, color }: { items: Principle[]; color: string }) => (
    <ul className="space-y-2">
      {items.map((principle) => (
        <li key={principle.id} className="flex items-start">
          <span className={`${color} mr-2`}>•</span>
          <span className="text-slate-700">{principle.content}</span>
        </li>
      ))}
    </ul>
  );

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
          <PrincipleList items={universalPrinciples} color="text-blue-500" />
        </section>
      )}

      {topPrinciples.length > 0 && (
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            When on Top
          </h3>
          <PrincipleList items={topPrinciples} color="text-green-500" />
        </section>
      )}

      {bottomPrinciples.length > 0 && (
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            When on Bottom
          </h3>
          <PrincipleList items={bottomPrinciples} color="text-orange-500" />
        </section>
      )}
    </div>
  );
}
