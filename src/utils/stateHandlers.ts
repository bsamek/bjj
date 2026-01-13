import type { AppData, Technique, Principle } from '../types';

type SetDataFn = (value: AppData | ((prev: AppData) => AppData)) => void;
type Perspective = 'top' | 'bottom';

// Handler types for grouped props
export interface ArrayHandlers {
  add: (positionId: string, perspective: Perspective, item: string) => void;
  update: (positionId: string, perspective: Perspective, index: number, item: string) => void;
  delete: (positionId: string, perspective: Perspective, index: number) => void;
}

export interface TechniqueHandlers {
  add: (positionId: string, perspective: Perspective, technique: Omit<Technique, 'id'>) => void;
  update: (positionId: string, perspective: Perspective, techniqueId: string, updates: Partial<Technique>) => void;
  delete: (positionId: string, perspective: Perspective, techniqueId: string) => void;
  addNote: (positionId: string, perspective: Perspective, techniqueId: string, note: string) => void;
  updateNote: (positionId: string, perspective: Perspective, techniqueId: string, index: number, note: string) => void;
  deleteNote: (positionId: string, perspective: Perspective, techniqueId: string, index: number) => void;
}

export interface PrincipleHandlers {
  add: (principle: Omit<Principle, 'id'>) => void;
  update: (principleId: string, updates: Partial<Principle>) => void;
  delete: (principleId: string) => void;
}

// Create handlers for perspective string arrays (doFirst, transitions, notes)
export function createArrayHandlers(
  setData: SetDataFn,
  arrayKey: 'doFirst' | 'transitions' | 'notes'
): ArrayHandlers {
  return {
    add: (positionId, perspective, item) => {
      setData((prev) => ({
        ...prev,
        positions: prev.positions.map((pos) =>
          pos.id === positionId
            ? {
                ...pos,
                [perspective]: {
                  ...pos[perspective],
                  [arrayKey]: [...pos[perspective][arrayKey], item],
                },
              }
            : pos
        ),
      }));
    },
    update: (positionId, perspective, index, item) => {
      setData((prev) => ({
        ...prev,
        positions: prev.positions.map((pos) =>
          pos.id === positionId
            ? {
                ...pos,
                [perspective]: {
                  ...pos[perspective],
                  [arrayKey]: pos[perspective][arrayKey].map((v, i) =>
                    i === index ? item : v
                  ),
                },
              }
            : pos
        ),
      }));
    },
    delete: (positionId, perspective, index) => {
      setData((prev) => ({
        ...prev,
        positions: prev.positions.map((pos) =>
          pos.id === positionId
            ? {
                ...pos,
                [perspective]: {
                  ...pos[perspective],
                  [arrayKey]: pos[perspective][arrayKey].filter((_, i) => i !== index),
                },
              }
            : pos
        ),
      }));
    },
  };
}

// Create handlers for techniques
export function createTechniqueHandlers(setData: SetDataFn): TechniqueHandlers {
  return {
    add: (positionId, perspective, technique) => {
      setData((prev) => ({
        ...prev,
        positions: prev.positions.map((pos) =>
          pos.id === positionId
            ? {
                ...pos,
                [perspective]: {
                  ...pos[perspective],
                  techniques: [
                    ...pos[perspective].techniques,
                    { ...technique, id: `t${Date.now()}` },
                  ],
                },
              }
            : pos
        ),
      }));
    },
    update: (positionId, perspective, techniqueId, updates) => {
      setData((prev) => ({
        ...prev,
        positions: prev.positions.map((pos) =>
          pos.id === positionId
            ? {
                ...pos,
                [perspective]: {
                  ...pos[perspective],
                  techniques: pos[perspective].techniques.map((tech) =>
                    tech.id === techniqueId ? { ...tech, ...updates } : tech
                  ),
                },
              }
            : pos
        ),
      }));
    },
    delete: (positionId, perspective, techniqueId) => {
      setData((prev) => ({
        ...prev,
        positions: prev.positions.map((pos) =>
          pos.id === positionId
            ? {
                ...pos,
                [perspective]: {
                  ...pos[perspective],
                  techniques: pos[perspective].techniques.filter(
                    (tech) => tech.id !== techniqueId
                  ),
                },
              }
            : pos
        ),
      }));
    },
    addNote: (positionId, perspective, techniqueId, note) => {
      setData((prev) => ({
        ...prev,
        positions: prev.positions.map((pos) =>
          pos.id === positionId
            ? {
                ...pos,
                [perspective]: {
                  ...pos[perspective],
                  techniques: pos[perspective].techniques.map((tech) =>
                    tech.id === techniqueId
                      ? { ...tech, notes: [...tech.notes, note] }
                      : tech
                  ),
                },
              }
            : pos
        ),
      }));
    },
    updateNote: (positionId, perspective, techniqueId, index, note) => {
      setData((prev) => ({
        ...prev,
        positions: prev.positions.map((pos) =>
          pos.id === positionId
            ? {
                ...pos,
                [perspective]: {
                  ...pos[perspective],
                  techniques: pos[perspective].techniques.map((tech) =>
                    tech.id === techniqueId
                      ? {
                          ...tech,
                          notes: tech.notes.map((n, i) => (i === index ? note : n)),
                        }
                      : tech
                  ),
                },
              }
            : pos
        ),
      }));
    },
    deleteNote: (positionId, perspective, techniqueId, index) => {
      setData((prev) => ({
        ...prev,
        positions: prev.positions.map((pos) =>
          pos.id === positionId
            ? {
                ...pos,
                [perspective]: {
                  ...pos[perspective],
                  techniques: pos[perspective].techniques.map((tech) =>
                    tech.id === techniqueId
                      ? {
                          ...tech,
                          notes: tech.notes.filter((_, i) => i !== index),
                        }
                      : tech
                  ),
                },
              }
            : pos
        ),
      }));
    },
  };
}

// Create handlers for principles
export function createPrincipleHandlers(setData: SetDataFn): PrincipleHandlers {
  return {
    add: (principle) => {
      setData((prev) => ({
        ...prev,
        principles: [
          ...prev.principles,
          { ...principle, id: `p${Date.now()}` },
        ],
      }));
    },
    update: (principleId, updates) => {
      setData((prev) => ({
        ...prev,
        principles: prev.principles.map((p) =>
          p.id === principleId ? { ...p, ...updates } : p
        ),
      }));
    },
    delete: (principleId) => {
      setData((prev) => ({
        ...prev,
        principles: prev.principles.filter((p) => p.id !== principleId),
      }));
    },
  };
}
