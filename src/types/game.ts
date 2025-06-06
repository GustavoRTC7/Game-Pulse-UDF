export interface Player {
  id: string;
  username: string;
  team: 'home' | 'away';
  isReady: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface ButtonPlayer {
  id: number;
  position: Position;
  team: 'home' | 'away';
  selected: boolean;
}

export interface Ball {
  position: Position;
  velocity: Position;
}

export interface GameState {
  players: Player[];
  buttonPlayers: ButtonPlayer[];
  ball: Ball;
  score: {
    home: number;
    away: number;
  };
  gameStatus: 'waiting' | 'playing' | 'finished';
  currentTurn: 'home' | 'away';
  timeRemaining: number;
}