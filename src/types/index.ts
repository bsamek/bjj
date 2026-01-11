export interface Technique {
  id: string;
  name: string;
  description: string;
  notes: string[];
}

export interface PositionPerspective {
  doFirst: string[];
  techniques: Technique[];
  transitions: string[];
  notes: string[];
}

export interface Position {
  id: string;
  name: string;
  top: PositionPerspective;
  bottom: PositionPerspective;
}

export interface Principle {
  id: string;
  content: string;
  category?: 'bottom' | 'top' | 'universal';
}

export interface AppData {
  positions: Position[];
  principles: Principle[];
}
