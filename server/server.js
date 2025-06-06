const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { Chess } = require('chess.js');

const app = express();
const server = http.createServer(app);

// Configurar CORS para permitir conexões de qualquer origem
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false
  },
  transports: ['websocket', 'polling']
});

const PORT = process.env.PORT || 3001;

// Armazenar salas de jogo
const gameRooms = new Map();

// Classe para gerenciar uma partida de xadrez
class ChessGame {
  constructor(roomId) {
    this.roomId = roomId;
    this.chess = new Chess();
    this.players = {};
    this.spectators = [];
    this.gameState = 'waiting'; // waiting, playing, finished
    this.currentTurn = 'white';
    this.moveHistory = [];
    this.timeControl = {
      white: 600000, // 10 minutos em ms
      away: 600000
    };
    this.lastMoveTime = Date.now();
  }

  addPlayer(socketId, playerData) {
    if (Object.keys(this.players).length < 2) {
      const color = Object.keys(this.players).length === 0 ? 'white' : 'black';
      this.players[socketId] = {
        ...playerData,
        color,
        ready: false
      };
      return color;
    }
    return null;
  }

  removePlayer(socketId) {
    if (this.players[socketId]) {
      delete this.players[socketId];
      if (Object.keys(this.players).length === 0) {
        this.gameState = 'finished';
      }
    }
  }

  makeMove(socketId, move) {
    const player = this.players[socketId];
    if (!player || this.gameState !== 'playing') {
      return { success: false, error: 'Game not in progress' };
    }

    if (player.color !== this.currentTurn) {
      return { success: false, error: 'Not your turn' };
    }

    try {
      const result = this.chess.move(move);
      if (result) {
        this.moveHistory.push({
          move: result,
          player: player.color,
          timestamp: Date.now()
        });
        
        this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
        this.lastMoveTime = Date.now();

        // Verificar fim de jogo
        if (this.chess.isGameOver()) {
          this.gameState = 'finished';
        }

        return { 
          success: true, 
          move: result,
          fen: this.chess.fen(),
          gameOver: this.chess.isGameOver(),
          winner: this.chess.isCheckmate() ? (this.currentTurn === 'white' ? 'black' : 'white') : null
        };
      }
    } catch (error) {
      return { success: false, error: 'Invalid move' };
    }

    return { success: false, error: 'Invalid move' };
  }

  startGame() {
    if (Object.keys(this.players).length === 2) {
      this.gameState = 'playing';
      this.lastMoveTime = Date.now();
      return true;
    }
    return false;
  }

  getGameState() {
    return {
      roomId: this.roomId,
      fen: this.chess.fen(),
      players: this.players,
      gameState: this.gameState,
      currentTurn: this.currentTurn,
      moveHistory: this.moveHistory,
      timeControl: this.timeControl
    };
  }
}

// Middleware
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'GamePulse Server is running!', 
    timestamp: new Date().toISOString(),
    activeRooms: gameRooms.size
  });
});

// Rota para listar salas ativas
app.get('/rooms', (req, res) => {
  const rooms = Array.from(gameRooms.values()).map(game => ({
    roomId: game.roomId,
    players: Object.keys(game.players).length,
    gameState: game.gameState
  }));
  res.json(rooms);
});

// Socket.IO eventos
io.on('connection', (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);

  // Criar ou entrar em uma sala
  socket.on('joinRoom', (data) => {
    const { roomId, playerData } = data;
    
    if (!gameRooms.has(roomId)) {
      gameRooms.set(roomId, new ChessGame(roomId));
    }

    const game = gameRooms.get(roomId);
    const playerColor = game.addPlayer(socket.id, playerData);

    if (playerColor) {
      socket.join(roomId);
      socket.roomId = roomId;
      socket.playerColor = playerColor;

      // Notificar todos na sala sobre o novo jogador
      io.to(roomId).emit('playerJoined', {
        playerId: socket.id,
        playerData: { ...playerData, color: playerColor },
        gameState: game.getGameState()
      });

      // Se temos 2 jogadores, iniciar o jogo
      if (Object.keys(game.players).length === 2) {
        game.startGame();
        io.to(roomId).emit('gameStarted', game.getGameState());
      }

      console.log(`Jogador ${playerData.username} entrou na sala ${roomId} como ${playerColor}`);
    } else {
      socket.emit('roomFull', { message: 'Sala está cheia' });
    }
  });

  // Fazer movimento
  socket.on('makeMove', (moveData) => {
    if (!socket.roomId) return;

    const game = gameRooms.get(socket.roomId);
    if (!game) return;

    const result = game.makeMove(socket.id, moveData);
    
    if (result.success) {
      // Notificar todos na sala sobre o movimento
      io.to(socket.roomId).emit('moveMade', {
        move: result.move,
        fen: result.fen,
        gameState: game.getGameState(),
        gameOver: result.gameOver,
        winner: result.winner
      });
    } else {
      socket.emit('moveError', { error: result.error });
    }
  });

  // Chat da sala
  socket.on('sendMessage', (messageData) => {
    if (!socket.roomId) return;

    const game = gameRooms.get(socket.roomId);
    if (!game || !game.players[socket.id]) return;

    const message = {
      id: Date.now().toString(),
      userId: socket.id,
      username: game.players[socket.id].username,
      text: messageData.text,
      timestamp: Date.now()
    };

    io.to(socket.roomId).emit('chatMessage', message);
  });

  // Solicitar estado atual do jogo
  socket.on('getGameState', () => {
    if (!socket.roomId) return;

    const game = gameRooms.get(socket.roomId);
    if (game) {
      socket.emit('gameState', game.getGameState());
    }
  });

  // Desconexão
  socket.on('disconnect', () => {
    console.log(`Usuário desconectado: ${socket.id}`);

    if (socket.roomId) {
      const game = gameRooms.get(socket.roomId);
      if (game) {
        game.removePlayer(socket.id);
        
        // Notificar outros jogadores
        socket.to(socket.roomId).emit('playerLeft', {
          playerId: socket.id,
          gameState: game.getGameState()
        });

        // Se não há mais jogadores, remover a sala
        if (Object.keys(game.players).length === 0) {
          gameRooms.delete(socket.roomId);
          console.log(`Sala ${socket.roomId} removida`);
        }
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
});