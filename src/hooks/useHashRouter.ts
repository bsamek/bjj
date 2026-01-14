import { useState, useEffect, useCallback } from 'react';

export type Perspective = 'top' | 'bottom';

export interface RouteState {
  currentView: 'principles' | 'position';
  selectedPositionId: string | null;
  perspective: Perspective;
}

export function parseHash(hash: string): RouteState {
  const path = hash.replace(/^#\/?/, '');

  if (path.startsWith('position/')) {
    const rest = path.slice('position/'.length);
    const parts = rest.split('/');
    const positionId = parts[0] || null;
    const perspective: Perspective = parts[1] === 'bottom' ? 'bottom' : 'top';
    return {
      currentView: 'position',
      selectedPositionId: positionId,
      perspective,
    };
  }

  return {
    currentView: 'principles',
    selectedPositionId: null,
    perspective: 'top',
  };
}

export function buildHash(state: RouteState): string {
  if (state.currentView === 'position' && state.selectedPositionId) {
    return `#/position/${state.selectedPositionId}/${state.perspective}`;
  }
  return '#/principles';
}

export function useHashRouter(): [
  RouteState,
  (view: 'principles' | 'position', positionId?: string | null, perspective?: Perspective) => void
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
    (view: 'principles' | 'position', positionId?: string | null, perspective: Perspective = 'top') => {
      const newState: RouteState = {
        currentView: view,
        selectedPositionId: view === 'position' ? (positionId ?? null) : null,
        perspective: view === 'position' ? perspective : 'top',
      };
      window.location.hash = buildHash(newState);
      setState(newState);
    },
    []
  );

  return [state, navigate];
}
