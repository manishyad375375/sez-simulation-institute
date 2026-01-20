
export interface TrajectoryPoint {
  x: number;
  y: number;
  t: number;
}

export interface SimulationState {
  angle: number;      // degrees
  velocity: number;   // m/s
  gravity: number;    // m/s^2
  isFiring: boolean;
  isComplete: boolean;
  history: TrajectoryPoint[];
  maxHeight: number;
  range: number;
  targetX: number;
  targetHit: boolean;
}

export interface QuadraticCoefficients {
  a: number;
  b: number;
  c: number;
}

export interface SimulationInfo {
  id: string;
  number: number;
  title: string;
  subject: string;
  concept: string;
  icon: string;
  color: string;
  status: 'available' | 'coming-soon';
}

// Database Types
export interface User {
  id: string;
  name: string;
  avatar: string;
  rank: string;
  joinedAt: string;
  email?: string;     // Added for admin login
  password?: string;  // Added for admin login
}

export interface ModuleProgress {
  completed: boolean;
  score: number;
  lastAccessed: string;
}

export interface UserProgress {
  [moduleId: string]: ModuleProgress;
}

// Biology Simulation Types
export interface Organelle {
  id: string;
  name: string;
  description: string;
  isPlantOnly?: boolean;
  isAnimalOnly?: boolean;
}

// Chemistry Simulation Types
export interface Molecule {
  id: string;
  name: string;
  formula: string;
  atoms: { type: 'H' | 'O' | 'C' | 'N'; count: number }[];
}
