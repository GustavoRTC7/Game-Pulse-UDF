import { create } from 'zustand';
import { GameState, Position, ButtonPlayer } from '../types/game';

interface GameStore extends GameState {
  selectPlayer: (playerId: number) => void;
  movePlayer: (position: Position) => void;
  kickBall: (force: Position) => void;
  updateGameState: (newState: Partial<GameState>) => void;
  resetGame: () => void;
}

const INITIAL_STATE: GameState = {
  players: [],
  buttonPlayers: Array.from({ length: 22 }, (_, i) => ({
    id: i,
    position: {
      x: i < 11 ? 100 + (i % 3) * 100 : 500 + (i % 3) * 100,
      y: 100 + Math.floor(i / 3) * 100
    },
    team: i < 11 ? 'home' : 'away',
    selected: false
  })),
  ball: {
    position: { x: 400, y: 300 },
    velocity: { x: 0, y: 0 }
  },
  score: {
    home: 0,
    away: 0
  },
  gameStatus: 'waiting',
  currentTurn: 'home',
  timeRemaining: 300 // 5 minutes in seconds
};

export const useGameStore = create<GameStore>((set) => ({
  ...INITIAL_STATE,

  selectPlayer: (playerId: number) =>
    set((state) => ({
      buttonPlayers: state.buttonPlayers.map((player) => ({
        ...player,
        selected: player.id === playerId
      }))
    })),

  movePlayer: (position: Position) =>
    set((state) => ({
      buttonPlayers: state.buttonPlayers.map((player) =>
        player.selected ? { ...player, position } : player
      )
    })),

  kickBall: (force: Position) =>
    set((state) => ({
      ball: {
        ...state.ball,
        velocity: force
      }
    })),

  updateGameState: (newState: Partial<GameState>) =>
    set((state) => ({ ...state, ...newState })),

  resetGame: () => set(INITIAL_STATE)
}));