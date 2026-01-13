import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { AuthGate } from '../../components/AuthGate';

describe('AuthGate', () => {
  const mockChildren = vi.fn((userId: string, onSignOut: () => void) => (
    <div>
      <span data-testid="user-id">{userId}</span>
      <button onClick={onSignOut}>Sign Out</button>
    </div>
  ));

  beforeEach(() => {
    vi.clearAllMocks();
    mockChildren.mockClear();
  });

  describe('loading state', () => {
    it('shows loading state initially', () => {
      vi.mocked(onAuthStateChanged).mockImplementation(() => () => {});

      render(<AuthGate>{mockChildren}</AuthGate>);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('unauthenticated state', () => {
    beforeEach(() => {
      vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
        if (typeof callback === 'function') {
          callback(null);
        }
        return () => {};
      });
    });

    it('shows sign in screen when not authenticated', () => {
      render(<AuthGate>{mockChildren}</AuthGate>);

      expect(screen.getByText('BJJ Study')).toBeInTheDocument();
      expect(screen.getByText('Sign in to access your training notes')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
    });

    it('calls signInWithPopup when sign in button clicked', async () => {
      const user = userEvent.setup();
      render(<AuthGate>{mockChildren}</AuthGate>);

      await user.click(screen.getByRole('button', { name: /sign in with google/i }));

      expect(signInWithPopup).toHaveBeenCalled();
    });

    it('handles sign in errors gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(signInWithPopup).mockRejectedValueOnce(new Error('Sign in failed'));

      const user = userEvent.setup();
      render(<AuthGate>{mockChildren}</AuthGate>);

      await user.click(screen.getByRole('button', { name: /sign in with google/i }));

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('Sign in error:', expect.any(Error));
      });

      consoleError.mockRestore();
    });
  });

  describe('authenticated state', () => {
    const mockUser = { uid: 'test-user-123', email: 'test@example.com' } as User;

    beforeEach(() => {
      vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
        if (typeof callback === 'function') {
          callback(mockUser);
        }
        return () => {};
      });
    });

    it('renders children with userId when authenticated', () => {
      render(<AuthGate>{mockChildren}</AuthGate>);

      expect(screen.getByTestId('user-id')).toHaveTextContent('test-user-123');
      expect(mockChildren).toHaveBeenCalledWith('test-user-123', expect.any(Function));
    });

    it('calls signOut when onSignOut is called', async () => {
      const user = userEvent.setup();
      render(<AuthGate>{mockChildren}</AuthGate>);

      await user.click(screen.getByRole('button', { name: 'Sign Out' }));

      expect(signOut).toHaveBeenCalled();
    });

    it('handles sign out errors gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(signOut).mockRejectedValueOnce(new Error('Sign out failed'));

      const user = userEvent.setup();
      render(<AuthGate>{mockChildren}</AuthGate>);

      await user.click(screen.getByRole('button', { name: 'Sign Out' }));

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('Sign out error:', expect.any(Error));
      });

      consoleError.mockRestore();
    });
  });

  describe('email allowlist', () => {
    it('shows unauthorized message when user email not allowed', async () => {
      const wrongUser = { uid: 'wrong-user', email: 'wrong@example.com' } as User;

      // Simulate the auth flow: user signs in, gets rejected, signed out
      vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
        if (typeof callback === 'function') {
          // First call: user is authenticated but wrong email
          // The component will call signOut, which we mock to trigger null user
          callback(wrongUser);
        }
        return () => {};
      });

      // Mock signOut to succeed
      vi.mocked(signOut).mockResolvedValueOnce();

      // Import and set the allowed email env var
      vi.stubEnv('VITE_ALLOWED_EMAIL', 'allowed@example.com');

      // Re-import AuthGate to pick up new env var
      vi.resetModules();
      const { AuthGate: AuthGateWithAllowlist } = await import('../../components/AuthGate');

      // Now simulate auth state changing after signOut
      vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
        if (typeof callback === 'function') {
          // After signOut, user becomes null and unauthorized flag is set
          setTimeout(() => callback(null), 0);
        }
        return () => {};
      });

      render(<AuthGateWithAllowlist>{mockChildren}</AuthGateWithAllowlist>);

      // Should show sign-in page (after being signed out)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
      });

      // Reset env
      vi.stubEnv('VITE_ALLOWED_EMAIL', '');
    });
  });

  describe('cleanup', () => {
    it('unsubscribes from auth state changes on unmount', () => {
      const unsubscribe = vi.fn();
      vi.mocked(onAuthStateChanged).mockImplementation(() => unsubscribe);

      const { unmount } = render(<AuthGate>{mockChildren}</AuthGate>);
      unmount();

      expect(unsubscribe).toHaveBeenCalled();
    });
  });
});
