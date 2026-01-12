interface NavigationProps {
  onLogout: () => void;
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export function Navigation({ onLogout, onMenuToggle, isMenuOpen }: NavigationProps) {
  return (
    <nav className="bg-slate-800 text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded hover:bg-slate-700"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          <h1 className="text-xl font-bold">BJJ Study</h1>
        </div>
        <button
          onClick={onLogout}
          className="px-3 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-700"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}
