import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { PositionView } from './components/PositionView';
import { PrinciplesView } from './components/PrinciplesView';
import { useLocalStorage } from './hooks/useLocalStorage';
import { initialData } from './data/initial-data';
import type { AppData, Technique, Principle } from './types';

function App() {
  const [data, setData] = useLocalStorage<AppData>('bjj-study-data', initialData);
  const [currentView, setCurrentView] = useState<'principles' | 'position'>('principles');
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(
    data.positions[0]?.id || null
  );

  const selectedPosition = data.positions.find((p) => p.id === selectedPositionId);

  const handleAddPrinciple = (principle: Omit<Principle, 'id'>) => {
    setData((prev) => ({
      ...prev,
      principles: [
        ...prev.principles,
        { ...principle, id: `p${Date.now()}` },
      ],
    }));
  };

  const handleAddTechnique = (
    positionId: string,
    perspective: 'top' | 'bottom',
    technique: Omit<Technique, 'id'>
  ) => {
    setData((prev) => ({
      ...prev,
      positions: prev.positions.map((pos) =>
        pos.id === positionId
          ? {
              ...pos,
              [perspective]: {
                ...pos[perspective],
                techniques: [
                  ...pos[perspective].techniques,
                  { ...technique, id: `t${Date.now()}` },
                ],
              },
            }
          : pos
      ),
    }));
  };

  const handleAddTechniqueNote = (
    positionId: string,
    perspective: 'top' | 'bottom',
    techniqueId: string,
    note: string
  ) => {
    setData((prev) => ({
      ...prev,
      positions: prev.positions.map((pos) =>
        pos.id === positionId
          ? {
              ...pos,
              [perspective]: {
                ...pos[perspective],
                techniques: pos[perspective].techniques.map((tech) =>
                  tech.id === techniqueId
                    ? { ...tech, notes: [...tech.notes, note] }
                    : tech
                ),
              },
            }
          : pos
      ),
    }));
  };

  const handleAddPerspectiveNote = (
    positionId: string,
    perspective: 'top' | 'bottom',
    note: string
  ) => {
    setData((prev) => ({
      ...prev,
      positions: prev.positions.map((pos) =>
        pos.id === positionId
          ? {
              ...pos,
              [perspective]: {
                ...pos[perspective],
                notes: [...pos[perspective].notes, note],
              },
            }
          : pos
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation
        positions={data.positions}
        currentView={currentView}
        selectedPositionId={selectedPositionId}
        onViewChange={setCurrentView}
        onPositionSelect={setSelectedPositionId}
      />
      <main className="py-6">
        {currentView === 'principles' ? (
          <PrinciplesView
            principles={data.principles}
            onAddPrinciple={handleAddPrinciple}
          />
        ) : selectedPosition ? (
          <PositionView
            position={selectedPosition}
            onAddTechnique={handleAddTechnique}
            onAddTechniqueNote={handleAddTechniqueNote}
            onAddPerspectiveNote={handleAddPerspectiveNote}
          />
        ) : null}
      </main>
    </div>
  );
}

export default App;
