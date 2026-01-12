import type { Position } from '../types';

interface NavigationProps {
  positions: Position[];
  currentView: 'principles' | 'position';
  selectedPositionId: string | null;
  onViewChange: (view: 'principles' | 'position') => void;
  onPositionSelect: (positionId: string) => void;
  onLogout: () => void;
}

export function Navigation({
  positions,
  currentView,
  selectedPositionId,
  onViewChange,
  onPositionSelect,
  onLogout,
}: NavigationProps) {
  return (
    <nav className="bg-slate-800 text-white p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">BJJ Study</h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => onViewChange('principles')}
            className={`px-3 py-1 rounded ${
              currentView === 'principles'
                ? 'bg-blue-600'
                : 'hover:bg-slate-700'
            }`}
          >
            Principles
          </button>
          <div className="relative">
            <select
              value={selectedPositionId || ''}
              onChange={(e) => {
                if (e.target.value) {
                  onPositionSelect(e.target.value);
                  onViewChange('position');
                }
              }}
              className={`px-3 py-1 rounded bg-slate-700 border-none cursor-pointer ${
                currentView === 'position' ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              <option value="" disabled>
                Positions
              </option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={onLogout}
            className="px-3 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-700"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
