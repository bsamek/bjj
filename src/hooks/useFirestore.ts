import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { AppData } from '../types';
import { initialData } from '../data/initial-data';

interface UseFirestoreResult {
  data: AppData;
  setData: (value: AppData | ((prev: AppData) => AppData)) => void;
  loading: boolean;
  error: Error | null;
}

export function useFirestore(userId: string): UseFirestoreResult {
  const [data, setDataState] = useState<AppData>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Subscribe to Firestore document
  useEffect(() => {
    const docRef = doc(db, 'users', userId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setDataState(snapshot.data() as AppData);
        } else {
          // First time user - migrate from localStorage or use initial data
          const localData = localStorage.getItem('bjj-study-data');
          const seedData = localData ? JSON.parse(localData) : initialData;

          // Save to Firestore
          setDoc(docRef, seedData).catch(console.error);
          setDataState(seedData);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Firestore error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Write to Firestore
  const setData = useCallback(
    (value: AppData | ((prev: AppData) => AppData)) => {
      const newData = typeof value === 'function' ? value(data) : value;
      setDataState(newData);

      const docRef = doc(db, 'users', userId);
      setDoc(docRef, newData).catch((err) => {
        console.error('Error writing to Firestore:', err);
        setError(err);
      });
    },
    [userId, data]
  );

  return { data, setData, loading, error };
}
