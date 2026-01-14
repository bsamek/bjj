import { useState, useEffect, useCallback } from 'react';

export interface RouteState {
  currentView: 'principles' | 'position';
  selectedPositionId: string | null;
}

export function parseHash(hash: string): RouteState {
  const path = hash.replace(/^#\/?/, '');

  if (path.startsWith('position/')) {
    const positionId = path.slice('position/'.length);
    return {
      currentView: 'position',
      selectedPositionId: positionId || null,
    };
  }

  return {
    currentView: 'principles',
    selectedPositionId: null,
  };
}

export function buildHash(state: RouteState): string {
  if (state.currentView === 'position' && state.selectedPositionId) {
    return `#/position/${state.selectedPositionId}`;
  }
  return '#/principles';
}

export function useHashRouter(): [
  RouteState,
  (view: 'principles' | 'position', positionId?: string | null) => void
] {
  const [state, setState] = useState<RouteState>(() =>
    parseHash(window.location.hash)
  );

  useEffect(() => {
    const handleHashChange = () => {
      setState(parseHash(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback(
    (view: 'principles' | 'position', positionId?: string | null) => {
      const newState: RouteState = {
        currentView: view,
        selectedPositionId: view === 'position' ? (positionId ?? null) : null,
      };
      window.location.hash = buildHash(newState);
      setState(newState);
    },
    []
  );

  return [state, navigate];
}
