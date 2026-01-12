import type { Position } from '../types';

interface SidebarProps {
  positions: Position[];
  currentView: 'principles' | 'position';
  selectedPositionId: string | null;
  onViewChange: (view: 'principles' | 'position') => void;
  onPositionSelect: (positionId: string) => void;
  onClose?: () => void;
}

export function Sidebar({
  positions,
  currentView,
  selectedPositionId,
  onViewChange,
  onPositionSelect,
  onClose,
}: SidebarProps) {
  const handleLinkClick = (callback: () => void) => {
    callback();
    onClose?.();
  };

  return (
    <aside className="w-56 bg-slate-800 text-white p-4 min-h-full">
      <nav className="space-y-4">
        <button
          onClick={() => handleLinkClick(() => onViewChange('principles'))}
          className={`block w-full text-left px-3 py-2 rounded ${
            currentView === 'principles'
              ? 'bg-blue-600'
              : 'hover:bg-slate-700'
          }`}
        >
          Principles
        </button>

        <div>
          <h3 className="px-3 py-2 text-slate-400 text-sm font-semibold uppercase tracking-wider">
            Positions
          </h3>
          <ul className="space-y-1">
            {positions.map((pos) => (
              <li key={pos.id}>
                <button
                  onClick={() =>
                    handleLinkClick(() => {
                      onPositionSelect(pos.id);
                      onViewChange('position');
                    })
                  }
                  className={`block w-full text-left px-3 py-2 rounded ${
                    currentView === 'position' && selectedPositionId === pos.id
                      ? 'bg-blue-600'
                      : 'hover:bg-slate-700'
                  }`}
                >
                  {pos.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
