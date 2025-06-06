import { io, Socket } from 'socket.io-client';

interface ChessPlayer {
  username: string;
  color: 'white' | 'black';
  ready: boolean;
}

interface GameState {
  roomId: string;
  fen: string;
  players: Record<string, ChessPlayer>;
  gameState: 'waiting' | 'playing' | 'finished';
  currentTurn: 'white' | 'black';
  moveHistory: any[];
  timeControl: {
    white: number;
    black: number;
  };
}

interface ChessMove {
  from: string;
  to: string;
  promotion?: string;
}

class ChessSocketService {
  private socket: Socket | null = null;
  private serverUrl: string;
  private callbacks: Record<string, Function[]> = {};

  constructor() {
    // URL do servidor - você vai alterar isso depois de hospedar
    this.serverUrl = process.env.NODE_ENV === 'production' 
      ? 'https://seu-servidor-aqui.herokuapp.com' // Você vai alterar isso
      : 'http://localhost:3001';
  }

  connect(username: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.serverUrl, {
          transports: ['websocket', 'polling'],
          timeout: 20000,
          forceNew: true
        });

        this.socket.on('connect', () => {
          console.log('Conectado ao servidor de xadrez');
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Erro de conexão:', error);
          reject(error);
        });

        this.setupEventListeners();
      } catch (error) {
        reject(error);
      }
    });
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('playerJoined', (data) => {
      this.emit('playerJoined', data);
    });

    this.socket.on('gameStarted', (data) => {
      this.emit('gameStarted', data);
    });

    this.socket.on('moveMade', (data) => {
      this.emit('moveMade', data);
    });

    this.socket.on('moveError', (data) => {
      this.emit('moveError', data);
    });

    this.socket.on('chatMessage', (data) => {
      this.emit('chatMessage', data);
    });

    this.socket.on('playerLeft', (data) => {
      this.emit('playerLeft', data);
    });

    this.socket.on('gameState', (data) => {
      this.emit('gameState', data);
    });

    this.socket.on('roomFull', (data) => {
      this.emit('roomFull', data);
    });
  }

  joinRoom(roomId: string, playerData: { username: string }): void {
    if (this.socket) {
      this.socket.emit('joinRoom', { roomId, playerData });
    }
  }

  makeMove(move: ChessMove): void {
    if (this.socket) {
      this.socket.emit('makeMove', move);
    }
  }

  sendMessage(text: string): void {
    if (this.socket) {
      this.socket.emit('sendMessage', { text });
    }
  }

  getGameState(): void {
    if (this.socket) {
      this.socket.emit('getGameState');
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Sistema de callbacks
  on(event: string, callback: Function): void {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  off(event: string, callback: Function): void {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
  }

  private emit(event: string, data: any): void {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const chessSocket = new ChessSocketService();
export type { ChessPlayer, GameState, ChessMove };