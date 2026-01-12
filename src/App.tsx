import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { PositionView } from './components/PositionView';
import { PrinciplesView } from './components/PrinciplesView';
import { AuthGate } from './components/AuthGate';
import { useFirestore } from './hooks/useFirestore';
import type { Technique, Principle } from './types';

function AppContent({ userId, onLogout }: { userId: string; onLogout: () => void }) {
  const { data, setData, loading, error } = useFirestore(userId);
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

  const handleUpdatePrinciple = (principleId: string, updates: Partial<Principle>) => {
    setData((prev) => ({
      ...prev,
      principles: prev.principles.map((p) =>
        p.id === principleId ? { ...p, ...updates } : p
      ),
    }));
  };

  const handleDeletePrinciple = (principleId: string) => {
    setData((prev) => ({
      ...prev,
      principles: prev.principles.filter((p) => p.id !== principleId),
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

  // Do First CRUD
  const handleAddDoFirst = (
    positionId: string,
    perspective: 'top' | 'bottom',
    item: string
  ) => {
    setData((prev) => ({
      ...prev,
      positions: prev.positions.map((pos) =>
        pos.id === positionId
          ? {
              ...pos,
              [perspective]: {
                ...pos[perspective],
                doFirst: [...pos[perspective].doFirst, item],
              },
            }
          : pos
      ),
    }));
  };

  const handleUpdateDoFirst = (
    positionId: string,
    perspective: 'top' | 'bottom',
    index: number,
    item: string
  ) => {
    setData((prev) => ({
      ...prev,
      positions: prev.positions.map((pos) =>
        pos.id === positionId
          ? {
              ...pos,
              [perspective]: {
                ...pos[perspective],
                doFirst: pos[perspective].doFirst.map((d, i) =>
                  i === index ? item : d
                ),
              },
            }
          : pos
      ),
    }));
  };

  const handleDeleteDoFirst = (
    positionId: string,
    perspective: 'top' | 'bottom',
    index: number
  ) => {
    setData((prev) => ({
      ...prev,
      positions: prev.positions.map((pos) =>
        pos.id === positionId
          ? {
              ...pos,
              [perspective]: {
                ...pos[perspective],
                doFirst: pos[perspective].doFirst.filter((_, i) => i !== index),
              },
            }
          : pos
      ),
    }));
  };

  // Transitions CRUD
  const handleAddTransition = (
    positionId: string,
    perspective: 'top' | 'bottom',
    item: string
  ) => {
    setData((prev) => ({
      ...prev,
      positions: prev.positions.map((pos) =>
        pos.id === positionId
          ? {
              ...pos,
              [perspective]: {
                ...pos[perspective],
                transitions: [...pos[perspective].transitions, item],
              },
            }
          : pos
      ),
    }));
  };

  const handleUpdateTransition = (
    positionId: string,
    perspective: 'top' | 'bottom',
    index: number,
    item: string
  ) => {
    setData((prev) => ({
      ...prev,
      positions: prev.positions.map((pos) =>
        pos.id === positionId
          ? {
              ...pos,
              [perspective]: {
                ...pos[perspective],
                transitions: pos[perspective].transitions.map((t, i) =>
                  i === index ? item : t
                ),
              },
            }
          : pos
      ),
    }));
  };

  const handleDeleteTransition = (
    positionId: string,
    perspective: 'top' | 'bottom',
    index: number
  ) => {
    setData((prev) => ({
      ...prev,
      positions: prev.positions.map((pos) =>
        pos.id === positionId
          ? {
              ...pos,
              [perspective]: {
                ...pos[perspective],
                transitions: pos[perspective].transitions.filter((_, i) => i !== index),
              },
            }
          : pos
      ),
    }));
  };

  // Technique Update/Delete
  const handleUpdateTechnique = (
    positionId: string,
    perspective: 'top' | 'bottom',
    techniqueId: string,
    updates: Partial<Technique>
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
                  tech.id === techniqueId ? { ...tech, ...updates } : tech
                ),
              },
            }
          : pos
      ),
    }));
  };

  const handleDeleteTechnique = (
    positionId: string,
    perspective: 'top' | 'bottom',
    techniqueId: string
  ) => {
    setData((prev) => ({
      ...prev,
      positions: prev.positions.map((pos) =>
        pos.id === positionId
          ? {
              ...pos,
              [perspective]: {
                ...pos[perspective],
                techniques: pos[perspective].techniques.filter(
                  (tech) => tech.id !== techniqueId
                ),
              },
            }
          : pos
      ),
    }));
  };

  // Perspective Notes Update/Delete
  const handleUpdatePerspectiveNote = (
    positionId: string,
    perspective: 'top' | 'bottom',
    index: number,
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
                notes: pos[perspective].notes.map((n, i) =>
                  i === index ? note : n
                ),
              },
            }
          : pos
      ),
    }));
  };

  const handleDeletePerspectiveNote = (
    positionId: string,
    perspective: 'top' | 'bottom',
    index: number
  ) => {
    setData((prev) => ({
      ...prev,
      positions: prev.positions.map((pos) =>
        pos.id === positionId
          ? {
              ...pos,
              [perspective]: {
                ...pos[perspective],
                notes: pos[perspective].notes.filter((_, i) => i !== index),
              },
            }
          : pos
      ),
    }));
  };

  // Technique Notes Update/Delete
  const handleUpdateTechniqueNote = (
    positionId: string,
    perspective: 'top' | 'bottom',
    techniqueId: string,
    index: number,
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
                    ? {
                        ...tech,
                        notes: tech.notes.map((n, i) => (i === index ? note : n)),
                      }
                    : tech
                ),
              },
            }
          : pos
      ),
    }));
  };

  const handleDeleteTechniqueNote = (
    positionId: string,
    perspective: 'top' | 'bottom',
    techniqueId: string,
    index: number
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
                    ? {
                        ...tech,
                        notes: tech.notes.filter((_, i) => i !== index),
                      }
                    : tech
                ),
              },
            }
          : pos
      ),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading your data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-red-500">Error loading data: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation
        positions={data.positions}
        currentView={currentView}
        selectedPositionId={selectedPositionId}
        onViewChange={setCurrentView}
        onPositionSelect={setSelectedPositionId}
        onLogout={onLogout}
      />
      <main className="py-6">
        {currentView === 'principles' ? (
          <PrinciplesView
            principles={data.principles}
            onAddPrinciple={handleAddPrinciple}
            onUpdatePrinciple={handleUpdatePrinciple}
            onDeletePrinciple={handleDeletePrinciple}
          />
        ) : selectedPosition ? (
          <PositionView
            position={selectedPosition}
            onAddTechnique={handleAddTechnique}
            onAddTechniqueNote={handleAddTechniqueNote}
            onAddPerspectiveNote={handleAddPerspectiveNote}
            onAddDoFirst={handleAddDoFirst}
            onUpdateDoFirst={handleUpdateDoFirst}
            onDeleteDoFirst={handleDeleteDoFirst}
            onAddTransition={handleAddTransition}
            onUpdateTransition={handleUpdateTransition}
            onDeleteTransition={handleDeleteTransition}
            onUpdateTechnique={handleUpdateTechnique}
            onDeleteTechnique={handleDeleteTechnique}
            onUpdatePerspectiveNote={handleUpdatePerspectiveNote}
            onDeletePerspectiveNote={handleDeletePerspectiveNote}
            onUpdateTechniqueNote={handleUpdateTechniqueNote}
            onDeleteTechniqueNote={handleDeleteTechniqueNote}
          />
        ) : null}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthGate>
      {(userId, onSignOut) => <AppContent userId={userId} onLogout={onSignOut} />}
    </AuthGate>
  );
}

export default App;
