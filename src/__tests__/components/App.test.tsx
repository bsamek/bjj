import { render, screen, waitFor, act } from '@testing-library/react';
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
    window.location.hash = '';
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

    await user.click(screen.getByRole('button', { name: 'Side Control' }));

    expect(screen.getByRole('heading', { name: 'Side Control' })).toBeInTheDocument();
  });

  it('switches back to PrinciplesView when Principles clicked', async () => {
    const user = userEvent.setup();
    await renderApp();

    // Go to position view
    await user.click(screen.getByRole('button', { name: 'Side Control' }));

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
    await user.click(screen.getByRole('button', { name: 'Closed Guard' }));
    expect(screen.getByRole('heading', { name: 'Closed Guard' })).toBeInTheDocument();

    // Go to Mount
    await user.click(screen.getByRole('button', { name: 'Mount' }));
    expect(screen.getByRole('heading', { name: 'Mount' })).toBeInTheDocument();
  });

  it('adds a technique to a position', async () => {
    const user = userEvent.setup();
    await renderApp();

    // Go to position view
    await user.click(screen.getByRole('button', { name: 'Side Control' }));

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
    await user.click(screen.getByRole('button', { name: 'Closed Guard' }));

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

    await user.click(screen.getByRole('button', { name: 'Side Control' }));

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

    await user.click(screen.getByRole('button', { name: 'Mount' }));
    await user.click(screen.getByRole('button', { name: 'Bottom' }));

    // Find the Notes section's Add Note button (usually last one)
    const addNoteButtons = screen.getAllByRole('button', { name: '+ Add Note' });
    await user.click(addNoteButtons[addNoteButtons.length - 1]);

    await user.type(screen.getByPlaceholderText('Add a note...'), 'Perspective note');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByText('Perspective note')).toBeInTheDocument();
  });
});

describe('App - Error and Loading States', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '';
    vi.clearAllMocks();

    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback({ uid: 'test-user-123', email: 'test@example.com' } as User);
      }
      return () => {};
    });
  });

  it('shows error state when Firestore fails', async () => {
    vi.mocked(onSnapshot).mockImplementation(((...args: unknown[]) => {
      const onError = args[2] as ((error: Error) => void) | undefined;
      if (typeof onError === 'function') {
        onError(new Error('Connection failed'));
      }
      return () => {};
    }) as typeof onSnapshot);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Error loading data: Connection failed/)).toBeInTheDocument();
    });
  });
});

describe('App - Mobile Menu', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '';
    vi.clearAllMocks();

    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback({ uid: 'test-user-123', email: 'test@example.com' } as User);
      }
      return () => {};
    });

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

  it('toggles mobile menu', async () => {
    const user = userEvent.setup();
    await renderApp();

    // Find and click the menu toggle button
    const menuButton = screen.getByRole('button', { name: /menu/i });
    await user.click(menuButton);

    // Mobile sidebar should appear - it has the same sidebar content
    // We can verify by checking the backdrop appears
    expect(document.querySelector('.bg-black\\/50')).toBeInTheDocument();
  });

  it('closes mobile menu when clicking backdrop', async () => {
    const user = userEvent.setup();
    await renderApp();

    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: /menu/i });
    await user.click(menuButton);

    // Click the backdrop
    const backdrop = document.querySelector('.bg-black\\/50');
    expect(backdrop).toBeInTheDocument();
    await user.click(backdrop!);

    // Backdrop should be gone
    expect(document.querySelector('.bg-black\\/50')).not.toBeInTheDocument();
  });

  it('closes mobile menu when selecting position', async () => {
    const user = userEvent.setup();
    await renderApp();

    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: /menu/i });
    await user.click(menuButton);

    // Click a position in the mobile sidebar (there are two Sidebars now)
    // The mobile one is in a fixed overlay
    const sideControlButtons = screen.getAllByRole('button', { name: 'Side Control' });
    await user.click(sideControlButtons[sideControlButtons.length - 1]);

    // Menu should close
    expect(document.querySelector('.bg-black\\/50')).not.toBeInTheDocument();
  });

  it('closes mobile menu and navigates to principles when clicking Principles', async () => {
    window.location.hash = '#/position/side-control';
    const user = userEvent.setup();
    await renderApp();

    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: /menu/i });
    await user.click(menuButton);

    // Click Principles in the mobile sidebar
    const principlesButtons = screen.getAllByRole('button', { name: 'Principles' });
    await user.click(principlesButtons[principlesButtons.length - 1]);

    // Menu should close and navigate to principles
    expect(document.querySelector('.bg-black\\/50')).not.toBeInTheDocument();
    expect(window.location.hash).toBe('#/principles');
  });
});

describe('App - Handler Coverage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '';
    vi.clearAllMocks();

    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback({ uid: 'test-user-123', email: 'test@example.com' } as User);
      }
      return () => {};
    });

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

  it('updates a principle', async () => {
    const { setDoc } = await import('firebase/firestore');
    const user = userEvent.setup();
    await renderApp();

    // Find an existing principle and edit it
    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Updated principle');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(setDoc).toHaveBeenCalled();
  });

  it('deletes a principle', async () => {
    const { setDoc } = await import('firebase/firestore');
    const user = userEvent.setup();
    await renderApp();

    // Delete a principle - first click shows confirmation
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    await user.click(deleteButtons[0]);

    // Confirm the delete
    const confirmDialog = screen.getByText('Delete this principle?').closest('li');
    const confirmDeleteBtn = confirmDialog?.querySelector('button.bg-red-600');
    await user.click(confirmDeleteBtn!);

    expect(setDoc).toHaveBeenCalled();
  });

  it('updates a do first item', async () => {
    const { setDoc } = await import('firebase/firestore');
    const user = userEvent.setup();
    await renderApp();

    // Navigate to a position
    await user.click(screen.getByRole('button', { name: 'Side Control' }));

    // Find edit buttons for DoFirst items
    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Updated do first');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(setDoc).toHaveBeenCalled();
  });

  it('deletes a do first item', async () => {
    const { setDoc } = await import('firebase/firestore');
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: 'Side Control' }));

    // First click shows confirmation
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    await user.click(deleteButtons[0]);

    // Confirm the delete
    const confirmDialog = screen.getByText('Delete this item?').closest('li');
    const confirmDeleteBtn = confirmDialog?.querySelector('button.bg-red-600');
    await user.click(confirmDeleteBtn!);

    expect(setDoc).toHaveBeenCalled();
  });

  it('adds a do first item', async () => {
    const { setDoc } = await import('firebase/firestore');
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: 'Side Control' }));

    const addButtons = screen.getAllByRole('button', { name: '+ Add' });
    await user.click(addButtons[0]);

    await user.type(screen.getByPlaceholderText('Add a do first item...'), 'New do first');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByText('New do first')).toBeInTheDocument();
    expect(setDoc).toHaveBeenCalled();
  });

  it('updates a transition', async () => {
    const { setDoc } = await import('firebase/firestore');
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: 'Side Control' }));

    // Find the transitions section edit buttons (they come after doFirst and techniques)
    // Look for the → bullet which indicates a transition item
    const transitionItems = screen.getAllByText('→');
    const transitionItem = transitionItems[0].closest('li');
    const editButton = transitionItem?.querySelector('button');
    if (editButton) {
      await user.click(editButton);
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Updated transition');
      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(setDoc).toHaveBeenCalled();
    }
  });

  it('adds a transition', async () => {
    const { setDoc } = await import('firebase/firestore');
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: 'Side Control' }));

    const addButtons = screen.getAllByRole('button', { name: '+ Add' });
    await user.click(addButtons[1]); // Transitions is second

    await user.type(screen.getByPlaceholderText('Add a transition...'), 'New transition');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByText('New transition')).toBeInTheDocument();
    expect(setDoc).toHaveBeenCalled();
  });

  it('deletes a transition', async () => {
    const { setDoc } = await import('firebase/firestore');
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: 'Side Control' }));

    // Find transition delete button (item with → bullet)
    const transitionItems = screen.getAllByText('→');
    const transitionItem = transitionItems[0].closest('li');
    const deleteButton = transitionItem?.querySelectorAll('button')[1]; // Second button is delete
    if (deleteButton) {
      await user.click(deleteButton);

      // Confirm the delete
      const confirmDialog = screen.getByText('Delete this item?').closest('li');
      const confirmDeleteBtn = confirmDialog?.querySelector('button.bg-red-600');
      await user.click(confirmDeleteBtn!);

      expect(setDoc).toHaveBeenCalled();
    }
  });

  it('updates a technique', async () => {
    const { setDoc } = await import('firebase/firestore');
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: 'Closed Guard' }));
    await user.click(screen.getByRole('button', { name: 'Bottom' }));

    // Find the first technique's edit button (Hip-Bump Sweep)
    const editTechniqueButtons = screen.getAllByTitle('Edit technique');
    expect(editTechniqueButtons.length).toBeGreaterThan(0);
    await user.click(editTechniqueButtons[0]);

    const nameInput = screen.getByPlaceholderText('Technique name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Sweep');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(setDoc).toHaveBeenCalled();
    expect(screen.getByText('Updated Sweep')).toBeInTheDocument();
  });

  it('deletes a technique', async () => {
    const { setDoc } = await import('firebase/firestore');
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: 'Closed Guard' }));
    await user.click(screen.getByRole('button', { name: 'Bottom' }));

    // First verify the technique exists
    expect(screen.getByText('Hip-Bump Sweep (Sit-Up Sweep)')).toBeInTheDocument();

    // Find and click the delete button for first technique
    const deleteTechniqueButtons = screen.getAllByTitle('Delete technique');
    expect(deleteTechniqueButtons.length).toBeGreaterThan(0);
    await user.click(deleteTechniqueButtons[0]);

    // Confirm the delete - find the red confirmation button
    const confirmationText = screen.getByText(/Delete "Hip-Bump Sweep/);
    expect(confirmationText).toBeInTheDocument();
    const confirmationCard = confirmationText.closest('div');
    const confirmButton = confirmationCard?.querySelector('button.bg-red-600');
    expect(confirmButton).toBeInTheDocument();
    await user.click(confirmButton!);

    expect(setDoc).toHaveBeenCalled();
    expect(screen.queryByText('Hip-Bump Sweep (Sit-Up Sweep)')).not.toBeInTheDocument();
  });

  it('updates a perspective note', async () => {
    const { setDoc } = await import('firebase/firestore');
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: 'Side Control' }));

    // Find perspective note and edit it
    const noteItem = screen.getByText(/Mousetrap system/).closest('li');
    expect(noteItem).toBeInTheDocument();
    const editButton = noteItem!.querySelector('button');
    expect(editButton).toBeInTheDocument();
    await user.click(editButton!);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Updated perspective note');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(setDoc).toHaveBeenCalled();
    expect(screen.getByText('Updated perspective note')).toBeInTheDocument();
  });

  it('deletes a perspective note', async () => {
    const { setDoc } = await import('firebase/firestore');
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: 'Side Control' }));

    // Find perspective note and delete it
    const noteItem = screen.getByText(/Mousetrap system/).closest('li');
    expect(noteItem).toBeInTheDocument();
    const buttons = noteItem!.querySelectorAll('button');
    const deleteButton = buttons[1]; // Second button is delete
    expect(deleteButton).toBeInTheDocument();
    await user.click(deleteButton);

    // Confirm the delete
    const confirmDialog = screen.getByText('Delete this item?').closest('li');
    const confirmDeleteBtn = confirmDialog?.querySelector('button.bg-red-600');
    await user.click(confirmDeleteBtn!);

    expect(setDoc).toHaveBeenCalled();
    expect(screen.queryByText(/Mousetrap system/)).not.toBeInTheDocument();
  });

  it('updates a technique note', async () => {
    const { setDoc } = await import('firebase/firestore');
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: 'Closed Guard' }));
    await user.click(screen.getByRole('button', { name: 'Bottom' }));

    // Scissor Sweep has a unique note - use it
    const noteItem = screen.getByText(/fake the scissor sweep/).closest('li');
    expect(noteItem).toBeInTheDocument();
    const editButton = noteItem!.querySelector('button');
    expect(editButton).toBeInTheDocument();
    await user.click(editButton!);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Updated technique note');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(setDoc).toHaveBeenCalled();
    expect(screen.getByText('Updated technique note')).toBeInTheDocument();
  });

  it('deletes a technique note', async () => {
    const { setDoc } = await import('firebase/firestore');
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: 'Closed Guard' }));
    await user.click(screen.getByRole('button', { name: 'Bottom' }));

    // Scissor Sweep has a unique note - use it
    const noteItem = screen.getByText(/fake the scissor sweep/).closest('li');
    expect(noteItem).toBeInTheDocument();
    const buttons = noteItem!.querySelectorAll('button');
    const deleteButton = buttons[1]; // Second button is delete
    expect(deleteButton).toBeInTheDocument();
    await user.click(deleteButton);

    // Confirm the delete
    const confirmDialog = screen.getByText('Delete this item?').closest('li');
    const confirmDeleteBtn = confirmDialog?.querySelector('button.bg-red-600');
    await user.click(confirmDeleteBtn!);

    expect(setDoc).toHaveBeenCalled();
    expect(screen.queryByText(/fake the scissor sweep/)).not.toBeInTheDocument();
  });
});

describe('App - Edge Cases', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '';
    vi.clearAllMocks();

    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback({ uid: 'test-user-123', email: 'test@example.com' } as User);
      }
      return () => {};
    });
  });

  it('handles empty positions array', async () => {
    // Mock Firestore to return data with no positions
    vi.mocked(onSnapshot).mockImplementation(((...args: unknown[]) => {
      const onNext = args[1] as ((snapshot: DocumentSnapshot<AppData>) => void) | undefined;
      if (typeof onNext === 'function') {
        onNext({
          exists: () => true,
          data: () => ({
            principles: [],
            positions: [],
          }),
        } as unknown as DocumentSnapshot<AppData>);
      }
      return () => {};
    }) as typeof onSnapshot);

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Loading your data...')).not.toBeInTheDocument();
    });

    // Should still render the app with empty data
    expect(screen.getByText('BJJ Study')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Principles' })).toBeInTheDocument();
  });

  it('handles position view with no selected position', async () => {
    // Mock Firestore to return data with positions
    vi.mocked(onSnapshot).mockImplementation(((...args: unknown[]) => {
      const onNext = args[1] as ((snapshot: DocumentSnapshot<AppData>) => void) | undefined;
      if (typeof onNext === 'function') {
        onNext({
          exists: () => true,
          data: () => ({
            principles: [],
            positions: [], // Empty positions
          }),
        } as unknown as DocumentSnapshot<AppData>);
      }
      return () => {};
    }) as typeof onSnapshot);

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Loading your data...')).not.toBeInTheDocument();
    });

    // PrinciplesView should be shown by default
    expect(screen.getByRole('heading', { name: 'Principles' })).toBeInTheDocument();
  });

  it('renders null when position view selected but no position exists', async () => {
    const user = userEvent.setup();

    // Store the callback so we can call it again to simulate data updates
    let firestoreCallback: ((snapshot: DocumentSnapshot<AppData>) => void) | null = null;

    // Mock that captures the callback for later use
    vi.mocked(onSnapshot).mockImplementation(((...args: unknown[]) => {
      const onNext = args[1] as ((snapshot: DocumentSnapshot<AppData>) => void) | undefined;
      if (typeof onNext === 'function') {
        firestoreCallback = onNext;
        // Initial data with a position
        onNext({
          exists: () => true,
          data: () => ({
            principles: [],
            positions: [{
              id: 'temp-pos',
              name: 'Temp Position',
              top: { doFirst: [], transitions: [], techniques: [], notes: [] },
              bottom: { doFirst: [], transitions: [], techniques: [], notes: [] },
            }],
          }),
        } as unknown as DocumentSnapshot<AppData>);
      }
      return () => {};
    }) as typeof onSnapshot);

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Loading your data...')).not.toBeInTheDocument();
    });

    // Click on the position to switch to position view
    await user.click(screen.getByRole('button', { name: 'Temp Position' }));

    // Verify we're on position view
    expect(screen.getByRole('heading', { name: 'Temp Position' })).toBeInTheDocument();

    // Simulate Firestore update that removes all positions while we're in position view
    // This triggers the null branch since currentView='position' but selectedPosition is undefined
    firestoreCallback!({
      exists: () => true,
      data: () => ({
        principles: [],
        positions: [], // Positions removed
      }),
    } as unknown as DocumentSnapshot<AppData>);

    // The heading should be gone now (null rendered in main content)
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Temp Position' })).not.toBeInTheDocument();
    });

    // Main content should be empty (null) but sidebar and navigation still there
    expect(screen.getByText('BJJ Study')).toBeInTheDocument();
  });

  it('updates technique note at non-zero index', async () => {
    const { setDoc } = await import('firebase/firestore');
    const user = userEvent.setup();

    // Create test data with a technique that has multiple notes
    const testDataWithMultipleNotes = {
      principles: [],
      positions: [{
        id: 'test-pos',
        name: 'Test Position',
        top: {
          doFirst: [],
          transitions: [],
          techniques: [{
            id: 'tech-multi',
            name: 'Multi-Note Technique',
            description: 'A technique with multiple notes',
            notes: ['First note', 'Second note', 'Third note'],
          }],
          notes: [],
        },
        bottom: {
          doFirst: [],
          transitions: [],
          techniques: [],
          notes: [],
        },
      }],
    };

    vi.mocked(onSnapshot).mockImplementation(((...args: unknown[]) => {
      const onNext = args[1] as ((snapshot: DocumentSnapshot<AppData>) => void) | undefined;
      if (typeof onNext === 'function') {
        onNext({
          exists: () => true,
          data: () => testDataWithMultipleNotes,
        } as unknown as DocumentSnapshot<AppData>);
      }
      return () => {};
    }) as typeof onSnapshot);

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Loading your data...')).not.toBeInTheDocument();
    });

    // Navigate to the test position
    await user.click(screen.getByRole('button', { name: 'Test Position' }));

    // Find the second note and edit it (this hits index 1, covering the `n` branch in the map)
    const secondNoteItem = screen.getByText('Second note').closest('li');
    expect(secondNoteItem).toBeInTheDocument();
    const editButton = secondNoteItem!.querySelector('button');
    expect(editButton).toBeInTheDocument();
    await user.click(editButton!);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Updated second note');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(setDoc).toHaveBeenCalled();
    expect(screen.getByText('Updated second note')).toBeInTheDocument();
    // The first and third notes should remain unchanged
    expect(screen.getByText('First note')).toBeInTheDocument();
    expect(screen.getByText('Third note')).toBeInTheDocument();
  });
});

describe('App Integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '';
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
    await user.click(screen.getByRole('button', { name: 'Half Guard' }));

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

describe('App - URL Routing', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '';
    vi.clearAllMocks();

    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback({ uid: 'test-user-123', email: 'test@example.com' } as User);
      }
      return () => {};
    });

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

  it('shows principles view when hash is empty', async () => {
    await renderApp();
    expect(screen.getByRole('heading', { name: 'Principles' })).toBeInTheDocument();
  });

  it('shows principles view when hash is #/principles', async () => {
    window.location.hash = '#/principles';
    await renderApp();
    expect(screen.getByRole('heading', { name: 'Principles' })).toBeInTheDocument();
  });

  it('shows position view when hash is #/position/side-control', async () => {
    window.location.hash = '#/position/side-control';
    await renderApp();
    expect(screen.getByRole('heading', { name: 'Side Control' })).toBeInTheDocument();
  });

  it('updates hash when navigating to position', async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: 'Side Control' }));

    expect(window.location.hash).toBe('#/position/side-control');
  });

  it('updates hash when navigating to principles', async () => {
    window.location.hash = '#/position/mount';
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole('button', { name: 'Principles' }));

    expect(window.location.hash).toBe('#/principles');
  });

  it('falls back to first position if hash contains invalid position id', async () => {
    window.location.hash = '#/position/invalid-id';
    await renderApp();

    // Should fall back to first position (Closed Guard based on initial-data.ts)
    expect(screen.getByRole('heading', { name: 'Closed Guard' })).toBeInTheDocument();
  });

  it('responds to browser back/forward navigation', async () => {
    const user = userEvent.setup();
    await renderApp();

    // Navigate to position
    await user.click(screen.getByRole('button', { name: 'Mount' }));
    expect(screen.getByRole('heading', { name: 'Mount' })).toBeInTheDocument();

    // Simulate browser back button by changing hash and firing event
    act(() => {
      window.location.hash = '#/principles';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Principles' })).toBeInTheDocument();
    });
  });

  it('updates hash when clicking Principles button while on position view', async () => {
    window.location.hash = '#/position/side-control';
    const user = userEvent.setup();
    await renderApp();

    // Click Principles button
    await user.click(screen.getByRole('button', { name: 'Principles' }));

    expect(window.location.hash).toBe('#/principles');
    expect(screen.getByRole('heading', { name: 'Principles' })).toBeInTheDocument();
  });

  it('preserves position when clicking Principles then back to position view', async () => {
    const user = userEvent.setup();
    await renderApp();

    // Navigate to Side Control
    await user.click(screen.getByRole('button', { name: 'Side Control' }));
    expect(window.location.hash).toBe('#/position/side-control');

    // Click Principles
    await user.click(screen.getByRole('button', { name: 'Principles' }));
    expect(window.location.hash).toBe('#/principles');

    // Simulate browser forward (going back to position)
    act(() => {
      window.location.hash = '#/position/side-control';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Side Control' })).toBeInTheDocument();
    });
  });
});
