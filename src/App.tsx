import { useState, useMemo } from 'react';
import { Navigation } from './components/Navigation';
import { Sidebar } from './components/Sidebar';
import { PositionView } from './components/PositionView';
import { PrinciplesView } from './components/PrinciplesView';
import { AuthGate } from './components/AuthGate';
import { useFirestore } from './hooks/useFirestore';
import { useHashRouter } from './hooks/useHashRouter';
import {
  createArrayHandlers,
  createTechniqueHandlers,
  createPrincipleHandlers,
} from './utils/stateHandlers';

function AppContent({ userId, onLogout }: { userId: string; onLogout: () => void }) {
  const { data, setData, loading, error } = useFirestore(userId);
  const [routeState, navigate] = useHashRouter();
  const { currentView, selectedPositionId: routePositionId } = routeState;
  const selectedPositionId = data.positions.find((p) => p.id === routePositionId)
    ? routePositionId
    : currentView === 'position'
      ? (data.positions[0]?.id ?? null)
      : null;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const selectedPosition = data.positions.find((p) => p.id === selectedPositionId);

  // Create handlers using utilities
  const doFirstHandlers = useMemo(() => createArrayHandlers(setData, 'doFirst'), [setData]);
  const transitionHandlers = useMemo(() => createArrayHandlers(setData, 'transitions'), [setData]);
  const noteHandlers = useMemo(() => createArrayHandlers(setData, 'notes'), [setData]);
  const techniqueHandlers = useMemo(() => createTechniqueHandlers(setData), [setData]);
  const principleHandlers = useMemo(() => createPrincipleHandlers(setData), [setData]);

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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation
        onLogout={onLogout}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMenuOpen={isMobileMenuOpen}
      />
      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar
            positions={data.positions}
            currentView={currentView}
            selectedPositionId={selectedPositionId}
            onViewChange={(view) => { if (view === 'principles') navigate('principles'); }}
            onPositionSelect={(positionId) => navigate('position', positionId)}
          />
        </div>

        {/* Mobile sidebar overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full">
              <Sidebar
                positions={data.positions}
                currentView={currentView}
                selectedPositionId={selectedPositionId}
                onViewChange={(view) => { if (view === 'principles') navigate('principles'); }}
                onPositionSelect={(positionId) => navigate('position', positionId)}
                onClose={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}

        <main className="flex-1 py-6">
          {currentView === 'principles' ? (
            <PrinciplesView
              principles={data.principles}
              onAddPrinciple={principleHandlers.add}
              onUpdatePrinciple={principleHandlers.update}
              onDeletePrinciple={principleHandlers.delete}
            />
          ) : selectedPosition ? (
            <PositionView
              position={selectedPosition}
              doFirstHandlers={doFirstHandlers}
              transitionHandlers={transitionHandlers}
              noteHandlers={noteHandlers}
              techniqueHandlers={techniqueHandlers}
            />
          ) : null}
        </main>
      </div>
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
