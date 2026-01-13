import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { onSnapshot, setDoc, type DocumentSnapshot } from 'firebase/firestore';
import { useFirestore } from '../../hooks/useFirestore';
import { initialData } from '../../data/initial-data';
import type { AppData } from '../../types';

describe('useFirestore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('returns loading true initially', () => {
    // Don't call the snapshot callback to keep loading state
    vi.mocked(onSnapshot).mockImplementation(() => {
      return () => {};
    });

    const { result } = renderHook(() => useFirestore('test-user'));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('sets data from Firestore snapshot when document exists', async () => {
    const testData: AppData = {
      principles: [{ id: 'test-principle', content: 'Test principle', category: 'universal' }],
      positions: [],
    };

    vi.mocked(onSnapshot).mockImplementation(((...args: unknown[]) => {
      const onNext = args[1] as ((snapshot: DocumentSnapshot<AppData>) => void) | undefined;
      if (typeof onNext === 'function') {
        onNext({
          exists: () => true,
          data: () => testData,
        } as unknown as DocumentSnapshot<AppData>);
      }
      return () => {};
    }) as typeof onSnapshot);

    const { result } = renderHook(() => useFirestore('test-user'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(testData);
    expect(result.current.error).toBe(null);
  });

  it('uses initialData for new users when document does not exist', async () => {
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

    vi.mocked(setDoc).mockResolvedValue();

    const { result } = renderHook(() => useFirestore('new-user'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(initialData);
    // Should save initial data to Firestore
    expect(setDoc).toHaveBeenCalled();
  });

  it('migrates localStorage data for new users', async () => {
    const localStorageData: AppData = {
      principles: [{ id: 'local-principle', content: 'From localStorage', category: 'bottom' }],
      positions: [],
    };

    window.localStorage.setItem('bjj-study-data', JSON.stringify(localStorageData));

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

    vi.mocked(setDoc).mockResolvedValue();

    const { result } = renderHook(() => useFirestore('migrating-user'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(localStorageData);
    // Should save localStorage data to Firestore
    expect(setDoc).toHaveBeenCalled();
    const lastCall = vi.mocked(setDoc).mock.calls[0];
    expect(lastCall[1]).toEqual(localStorageData);
  });

  it('handles Firestore snapshot errors', async () => {
    const testError = new Error('Firestore error');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(onSnapshot).mockImplementation(((...args: unknown[]) => {
      const onError = args[2] as ((error: Error) => void) | undefined;
      if (typeof onError === 'function') {
        onError(testError);
      }
      return () => {};
    }) as typeof onSnapshot);

    const { result } = renderHook(() => useFirestore('test-user'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(testError);
    expect(consoleSpy).toHaveBeenCalledWith('Firestore error:', testError);

    consoleSpy.mockRestore();
  });

  it('setData updates local state and writes to Firestore', async () => {
    const initialTestData: AppData = {
      principles: [{ id: 'test', content: 'Initial', category: 'universal' }],
      positions: [],
    };

    vi.mocked(onSnapshot).mockImplementation(((...args: unknown[]) => {
      const onNext = args[1] as ((snapshot: DocumentSnapshot<AppData>) => void) | undefined;
      if (typeof onNext === 'function') {
        onNext({
          exists: () => true,
          data: () => initialTestData,
        } as unknown as DocumentSnapshot<AppData>);
      }
      return () => {};
    }) as typeof onSnapshot);

    vi.mocked(setDoc).mockResolvedValue();

    const { result } = renderHook(() => useFirestore('test-user'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newData: AppData = {
      principles: [{ id: 'test', content: 'Updated', category: 'universal' }],
      positions: [],
    };

    act(() => {
      result.current.setData(newData);
    });

    expect(result.current.data).toEqual(newData);
    expect(setDoc).toHaveBeenCalled();
    const lastCall = vi.mocked(setDoc).mock.calls[vi.mocked(setDoc).mock.calls.length - 1];
    expect(lastCall[1]).toEqual(newData);
  });

  it('setData accepts function updater', async () => {
    const initialTestData: AppData = {
      principles: [{ id: 'test', content: 'Initial', category: 'universal' }],
      positions: [],
    };

    vi.mocked(onSnapshot).mockImplementation(((...args: unknown[]) => {
      const onNext = args[1] as ((snapshot: DocumentSnapshot<AppData>) => void) | undefined;
      if (typeof onNext === 'function') {
        onNext({
          exists: () => true,
          data: () => initialTestData,
        } as unknown as DocumentSnapshot<AppData>);
      }
      return () => {};
    }) as typeof onSnapshot);

    vi.mocked(setDoc).mockResolvedValue();

    const { result } = renderHook(() => useFirestore('test-user'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setData((prev) => ({
        ...prev,
        principles: [...prev.principles, { id: 'new', content: 'New principle', category: 'top' }],
      }));
    });

    expect(result.current.data.principles).toHaveLength(2);
    expect(result.current.data.principles[1].content).toBe('New principle');
  });

  it('handles setDoc write errors', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const writeError = new Error('Write failed');

    const initialTestData: AppData = {
      principles: [],
      positions: [],
    };

    vi.mocked(onSnapshot).mockImplementation(((...args: unknown[]) => {
      const onNext = args[1] as ((snapshot: DocumentSnapshot<AppData>) => void) | undefined;
      if (typeof onNext === 'function') {
        onNext({
          exists: () => true,
          data: () => initialTestData,
        } as unknown as DocumentSnapshot<AppData>);
      }
      return () => {};
    }) as typeof onSnapshot);

    vi.mocked(setDoc).mockRejectedValue(writeError);

    const { result } = renderHook(() => useFirestore('test-user'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setData({ principles: [], positions: [] });
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error writing to Firestore:', writeError);
    });

    expect(result.current.error).toBe(writeError);

    consoleSpy.mockRestore();
  });

  it('cleans up Firestore subscription on unmount', () => {
    const unsubscribe = vi.fn();
    vi.mocked(onSnapshot).mockImplementation(() => {
      return unsubscribe;
    });

    const { unmount } = renderHook(() => useFirestore('test-user'));

    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });

  it('resubscribes when userId changes', () => {
    const unsubscribe1 = vi.fn();
    const unsubscribe2 = vi.fn();
    let callCount = 0;

    vi.mocked(onSnapshot).mockImplementation(() => {
      callCount++;
      return callCount === 1 ? unsubscribe1 : unsubscribe2;
    });

    const { rerender } = renderHook(({ userId }) => useFirestore(userId), {
      initialProps: { userId: 'user-1' },
    });

    rerender({ userId: 'user-2' });

    expect(unsubscribe1).toHaveBeenCalled();
    expect(onSnapshot).toHaveBeenCalledTimes(2);
  });
});
