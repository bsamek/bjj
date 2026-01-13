import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { AuthGate } from '../../components/AuthGate';

describe('AuthGate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    // Don't call the auth callback - leave in loading state
    vi.mocked(onAuthStateChanged).mockImplementation(() => {
      return () => {};
    });

    render(<AuthGate>{(userId) => <div>User: {userId}</div>}</AuthGate>);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders sign-in button when not authenticated', async () => {
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback(null);
      }
      return () => {};
    });

    render(<AuthGate>{(userId) => <div>User: {userId}</div>}</AuthGate>);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('BJJ Study')).toBeInTheDocument();
    expect(screen.getByText('Sign in to access your training notes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  it('calls children render prop with userId when authenticated', async () => {
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback({ uid: 'test-user-123', email: 'test@example.com' } as User);
      }
      return () => {};
    });

    render(<AuthGate>{(userId) => <div>User: {userId}</div>}</AuthGate>);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('User: test-user-123')).toBeInTheDocument();
  });

  it('handles sign-in button click', async () => {
    const user = userEvent.setup();

    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback(null);
      }
      return () => {};
    });

    vi.mocked(signInWithPopup).mockResolvedValue({} as never);

    render(<AuthGate>{(userId) => <div>User: {userId}</div>}</AuthGate>);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /sign in with google/i }));

    expect(signInWithPopup).toHaveBeenCalled();
  });

  it('handles sign-in error gracefully', async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback(null);
      }
      return () => {};
    });

    vi.mocked(signInWithPopup).mockRejectedValue(new Error('Sign in failed'));

    render(<AuthGate>{(userId) => <div>User: {userId}</div>}</AuthGate>);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /sign in with google/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Sign in error:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('provides sign-out callback and handles sign-out', async () => {
    const user = userEvent.setup();

    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback({ uid: 'test-user-123', email: 'test@example.com' } as User);
      }
      return () => {};
    });

    vi.mocked(signOut).mockResolvedValue();

    render(
      <AuthGate>
        {(_userId, onSignOut) => (
          <button onClick={onSignOut}>Sign Out</button>
        )}
      </AuthGate>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Sign Out' }));

    expect(signOut).toHaveBeenCalled();
  });

  it('handles sign-out error gracefully', async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback({ uid: 'test-user-123', email: 'test@example.com' } as User);
      }
      return () => {};
    });

    vi.mocked(signOut).mockRejectedValue(new Error('Sign out failed'));

    render(
      <AuthGate>
        {(_userId, onSignOut) => (
          <button onClick={onSignOut}>Sign Out</button>
        )}
      </AuthGate>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Sign Out' }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Sign out error:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('cleans up auth subscription on unmount', () => {
    const unsubscribe = vi.fn();
    vi.mocked(onAuthStateChanged).mockImplementation(() => {
      return unsubscribe;
    });

    const { unmount } = render(<AuthGate>{(userId) => <div>User: {userId}</div>}</AuthGate>);

    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});

describe('AuthGate with ALLOWED_EMAIL restriction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows access denied when email does not match ALLOWED_EMAIL', async () => {
    // Stub the env variable to restrict access
    vi.stubEnv('VITE_ALLOWED_EMAIL', 'allowed@example.com');

    // Re-import the component to pick up the env change
    vi.resetModules();
    const { AuthGate: RestrictedAuthGate } = await import('../../components/AuthGate');

    vi.mocked(signOut).mockResolvedValue();

    // User with wrong email tries to sign in
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        // Callback with wrong email - component should sign out and show unauthorized
        callback({ uid: 'wrong-user', email: 'wrong@example.com' } as User);
      }
      return () => {};
    });

    render(<RestrictedAuthGate>{(userId) => <div>User: {userId}</div>}</RestrictedAuthGate>);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Should have signed out the unauthorized user
    expect(signOut).toHaveBeenCalled();

    // Should show access denied message
    expect(screen.getByText('Access denied. This app is private.')).toBeInTheDocument();

    // Restore env
    vi.stubEnv('VITE_ALLOWED_EMAIL', '');
  });

  it('allows access when email matches ALLOWED_EMAIL', async () => {
    // Stub the env variable to restrict access
    vi.stubEnv('VITE_ALLOWED_EMAIL', 'allowed@example.com');

    // Re-import the component to pick up the env change
    vi.resetModules();
    const { AuthGate: RestrictedAuthGate } = await import('../../components/AuthGate');

    // User with correct email
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback({ uid: 'allowed-user', email: 'allowed@example.com' } as User);
      }
      return () => {};
    });

    render(<RestrictedAuthGate>{(userId) => <div>User: {userId}</div>}</RestrictedAuthGate>);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Should render the children
    expect(screen.getByText('User: allowed-user')).toBeInTheDocument();

    // Restore env
    vi.stubEnv('VITE_ALLOWED_EMAIL', '');
  });
});
