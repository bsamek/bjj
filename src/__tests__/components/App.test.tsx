import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { onSnapshot, type DocumentSnapshot } from 'firebase/firestore';
import App from '../../App';
import { initialData } from '../../data/initial-data';
import type { AppData } from '../../types';

// Helper to render App and wait for loading to complete
async function renderApp() {
  const result = render(<App />);
  // Wait for both AuthGate loading ("Loading...") and Firestore loading ("Loading your data...")
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading your data...')).not.toBeInTheDocument();
  });
  return result;
}

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();

    // Mock onAuthStateChanged to immediately call callback with a fake user
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback({ uid: 'test-user-123', email: 'test@example.com' } as User);
      }
      return () => {};
    });

    // Mock onSnapshot to immediately call callback with test data
    vi.mocked(onSnapshot).mockImplementation(((...args: unknown[]) => {
      const onNext = args[1] as ((snapshot: DocumentSnapshot<AppData>) => void) | undefined;
      if (typeof onNext === 'function') {
        onNext({
          exists: () => true,
          data: () => initialData,
        } as unknown as DocumentSnapshot<AppData>);
      }
      return () => {};
    }) as typeof onSnapshot);
  });

  it('renders Navigation and main content', async () => {
    await renderApp();
    expect(screen.getByText('BJJ Study')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Principles' })).toBeInTheDocument();
  });

  it('shows PrinciplesView by default', async () => {
    await renderApp();
    expect(screen.getByRole('heading', { name: 'Principles' })).toBeInTheDocument();
  });

  it('switches to PositionView when position selected', async () => {
    const user = userEvent.setup();
    await renderApp();

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'side-control');

    expect(screen.getByRole('heading', { name: 'Side Control' })).toBeInTheDocument();
  });

  it('switches back to PrinciplesView when Principles clicked', async () => {
    const user = userEvent.setup();
    await renderApp();

    // Go to position view
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'side-control');

    // Go back to principles
    await user.click(screen.getByRole('button', { name: 'Principles' }));

    expect(screen.getByRole('heading', { name: 'Principles' })).toBeInTheDocument();
  });

  it('adds a new principle', async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: '+ Add Principle' }));
    await user.type(screen.getByPlaceholderText('Enter principle...'), 'Test principle');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByText('Test principle')).toBeInTheDocument();
  });

  it('persists principles to Firestore', async () => {
    const { setDoc } = await import('firebase/firestore');
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: '+ Add Principle' }));
    await user.type(screen.getByPlaceholderText('Enter principle...'), 'Persisted principle');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(setDoc).toHaveBeenCalled();
    const lastCall = vi.mocked(setDoc).mock.calls[vi.mocked(setDoc).mock.calls.length - 1];
    const savedData = lastCall[1] as { principles: Array<{ content: string }> };
    expect(savedData.principles.some((p) => p.content === 'Persisted principle')).toBe(true);
  });

  it('navigates between positions', async () => {
    const user = userEvent.setup();
    await renderApp();

    // Go to Closed Guard
    await user.selectOptions(screen.getByRole('combobox'), 'closed-guard');
    expect(screen.getByRole('heading', { name: 'Closed Guard' })).toBeInTheDocument();

    // Go to Mount
    await user.selectOptions(screen.getByRole('combobox'), 'mount');
    expect(screen.getByRole('heading', { name: 'Mount' })).toBeInTheDocument();
  });

  it('adds a technique to a position', async () => {
    const user = userEvent.setup();
    await renderApp();

    // Go to position view
    await user.selectOptions(screen.getByRole('combobox'), 'side-control');

    // Add technique
    await user.click(screen.getByRole('button', { name: '+ Add Technique' }));
    await user.type(screen.getByPlaceholderText('Technique name'), 'New Submission');
    await user.type(screen.getByPlaceholderText('Description'), 'How to apply');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByText('New Submission')).toBeInTheDocument();
  });

  it('adds a note to a technique', async () => {
    const user = userEvent.setup();
    await renderApp();

    // Go to position view
    await user.selectOptions(screen.getByRole('combobox'), 'closed-guard');

    // Find a technique and add a note
    const noteButtons = screen.getAllByRole('button', { name: '+ Note' });
    await user.click(noteButtons[0]);
    await user.type(screen.getByPlaceholderText('Add a note...'), 'My personal note');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByText('My personal note')).toBeInTheDocument();
  });

  it('switches between top and bottom perspectives', async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.selectOptions(screen.getByRole('combobox'), 'side-control');

    // Verify we're on Top tab (default)
    expect(screen.getByText(/Crossface/i)).toBeInTheDocument();

    // Switch to Bottom
    await user.click(screen.getByRole('button', { name: 'Bottom' }));
    expect(screen.getByText('Knee-Elbow Escape (Shrimp to Guard)')).toBeInTheDocument();
  });

  it('renders initial data from localStorage (migration path)', async () => {
    // Pre-populate localStorage to simulate existing user data before Firebase migration
    const testData = {
      principles: [{ id: 'test', content: 'Loaded from storage', category: 'universal' }],
      positions: initialData.positions,
    };
    window.localStorage.setItem('bjj-study-data', JSON.stringify(testData));

    // Mock onSnapshot to return no existing Firestore data (new user scenario)
    vi.mocked(onSnapshot).mockImplementation(((...args: unknown[]) => {
      const onNext = args[1] as ((snapshot: DocumentSnapshot<AppData>) => void) | undefined;
      if (typeof onNext === 'function') {
        onNext({
          exists: () => false,
          data: () => null,
        } as unknown as DocumentSnapshot<AppData>);
      }
      return () => {};
    }) as typeof onSnapshot);

    await renderApp();

    expect(screen.getByText('Loaded from storage')).toBeInTheDocument();
  });

  it('adds perspective note', async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.selectOptions(screen.getByRole('combobox'), 'mount');
    await user.click(screen.getByRole('button', { name: 'Bottom' }));

    // Find the Notes section's Add Note button (usually last one)
    const addNoteButtons = screen.getAllByRole('button', { name: '+ Add Note' });
    await user.click(addNoteButtons[addNoteButtons.length - 1]);

    await user.type(screen.getByPlaceholderText('Add a note...'), 'Perspective note');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByText('Perspective note')).toBeInTheDocument();
  });
});

describe('App Integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();

    // Mock onAuthStateChanged to immediately call callback with a fake user
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback({ uid: 'test-user-123', email: 'test@example.com' } as User);
      }
      return () => {};
    });

    // Mock onSnapshot to immediately call callback with test data
    vi.mocked(onSnapshot).mockImplementation(((...args: unknown[]) => {
      const onNext = args[1] as ((snapshot: DocumentSnapshot<AppData>) => void) | undefined;
      if (typeof onNext === 'function') {
        onNext({
          exists: () => true,
          data: () => initialData,
        } as unknown as DocumentSnapshot<AppData>);
      }
      return () => {};
    }) as typeof onSnapshot);
  });

  it('full flow: add principle with category and verify grouping', async () => {
    const user = userEvent.setup();
    await renderApp();

    // Add a "top" principle
    await user.click(screen.getByRole('button', { name: '+ Add Principle' }));
    await user.type(screen.getByPlaceholderText('Enter principle...'), 'Stay heavy');
    await user.click(screen.getByLabelText('Top'));
    await user.click(screen.getByRole('button', { name: 'Add' }));

    // Verify it appears in the Top section
    const topSection = screen.getByText('When on Top').closest('section');
    expect(topSection).toContainElement(screen.getByText('Stay heavy'));
  });

  it('full flow: navigate, add technique, verify Firestore persistence', async () => {
    const { setDoc } = await import('firebase/firestore');
    const user = userEvent.setup();
    await renderApp();

    // Navigate to position
    await user.selectOptions(screen.getByRole('combobox'), 'half-guard');

    // Add technique
    await user.click(screen.getByRole('button', { name: '+ Add Technique' }));
    await user.type(screen.getByPlaceholderText('Technique name'), 'Test Sweep');
    await user.type(screen.getByPlaceholderText('Description'), 'Sweep description');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByText('Test Sweep')).toBeInTheDocument();

    // Verify Firestore persistence was called
    expect(setDoc).toHaveBeenCalled();
    const lastCall = vi.mocked(setDoc).mock.calls[vi.mocked(setDoc).mock.calls.length - 1];
    const savedData = lastCall[1] as { positions: Array<{ id: string; top: { techniques: Array<{ name: string }> } }> };
    const halfGuard = savedData.positions.find((p) => p.id === 'half-guard');
    expect(halfGuard?.top.techniques.some((t) => t.name === 'Test Sweep')).toBe(true);
  });
});
