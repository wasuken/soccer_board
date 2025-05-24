export interface Position {
  x: number;
  y: number;
}

export type PlayerPosition = 'GK' | 'DF' | 'MF' | 'FW';

export interface Player {
  id: stringexport interface Position {
  x: number;
  y: number;
}

export type PlayerPosition = 'GK' | 'DF' | 'MF' | 'FW';

export interface Player {
  id: string;
  name: string;
  number: number;
  position: Position;
  playerPosition: PlayerPosition;
  team: 'home' | 'away';
}

export interface Formation {
  id: string;
  name: string;
  description?: string;
  positions: Position[];
}

export interface FormationSet {
  basic: Formation;
  attack?: Formation;
  defense?: Formation;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  formations: { [key: string]: FormationSet };
  currentFormation: string;
  currentPhase: 'basic' | 'attack' | 'defense';
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
}
