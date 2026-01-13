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

  describe('initial loading state', () => {
    it('returns loading true initially', () => {
      vi.mocked(onSnapshot).mockImplementation(() => () => {});

      const { result } = renderHook(() => useFirestore('test-user'));

      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe(null);
    });
  });

  describe('data fetching', () => {
    it('loads data from Firestore when document exists', async () => {
      const testData: AppData = {
        principles: [{ id: 'p1', content: 'Test principle', category: 'universal' }],
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

    it('uses initialData when Firestore document does not exist and no localStorage', async () => {
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

      const { result } = renderHook(() => useFirestore('test-user'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(initialData);
    });

    it('migrates data from localStorage when Firestore document does not exist', async () => {
      const localData: AppData = {
        principles: [{ id: 'local', content: 'From localStorage', category: 'top' }],
        positions: initialData.positions,
      };
      window.localStorage.setItem('bjj-study-data', JSON.stringify(localData));

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

      const { result } = renderHook(() => useFirestore('test-user'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(localData);
      expect(setDoc).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('sets error when Firestore fails', async () => {
      const testError = new Error('Firestore error');

      vi.mocked(onSnapshot).mockImplementation(((...args: unknown[]) => {
        const onError = args[2] as ((err: Error) => void) | undefined;
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
    });
  });

  describe('setData function', () => {
    it('updates local state immediately', async () => {
      const testData: AppData = {
        principles: [{ id: 'p1', content: 'Original', category: 'universal' }],
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

      act(() => {
        result.current.setData({
          ...testData,
          principles: [{ id: 'p2', content: 'Updated', category: 'bottom' }],
        });
      });

      expect(result.current.data.principles[0].content).toBe('Updated');
    });

    it('accepts a function updater', async () => {
      const testData: AppData = {
        principles: [{ id: 'p1', content: 'Original', category: 'universal' }],
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

      act(() => {
        result.current.setData((prev) => ({
          ...prev,
          principles: [...prev.principles, { id: 'p2', content: 'Added', category: 'top' }],
        }));
      });

      expect(result.current.data.principles).toHaveLength(2);
      expect(result.current.data.principles[1].content).toBe('Added');
    });

    it('writes to Firestore when setData called', async () => {
      const testData: AppData = {
        principles: [],
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

      vi.mocked(setDoc).mockClear();

      act(() => {
        result.current.setData({
          principles: [{ id: 'new', content: 'New principle', category: 'universal' }],
          positions: [],
        });
      });

      expect(setDoc).toHaveBeenCalled();
    });

    it('handles Firestore write errors', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const testData: AppData = { principles: [], positions: [] };

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

      vi.mocked(setDoc).mockRejectedValueOnce(new Error('Write failed'));

      const { result } = renderHook(() => useFirestore('test-user'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setData({ principles: [], positions: [] });
      });

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('Error writing to Firestore:', expect.any(Error));
      });

      consoleError.mockRestore();
    });
  });

  describe('cleanup', () => {
    it('unsubscribes from Firestore on unmount', () => {
      const unsubscribe = vi.fn();
      vi.mocked(onSnapshot).mockImplementation(() => unsubscribe);

      const { unmount } = renderHook(() => useFirestore('test-user'));
      unmount();

      expect(unsubscribe).toHaveBeenCalled();
    });

    it('resubscribes when userId changes', async () => {
      const unsubscribe = vi.fn();
      vi.mocked(onSnapshot).mockImplementation(((...args: unknown[]) => {
        const onNext = args[1] as ((snapshot: DocumentSnapshot<AppData>) => void) | undefined;
        if (typeof onNext === 'function') {
          onNext({
            exists: () => true,
            data: () => initialData,
          } as unknown as DocumentSnapshot<AppData>);
        }
        return unsubscribe;
      }) as typeof onSnapshot);

      const { rerender } = renderHook(({ userId }) => useFirestore(userId), {
        initialProps: { userId: 'user-1' },
      });

      expect(onSnapshot).toHaveBeenCalledTimes(1);

      rerender({ userId: 'user-2' });

      expect(unsubscribe).toHaveBeenCalled();
      expect(onSnapshot).toHaveBeenCalledTimes(2);
    });
  });
});
