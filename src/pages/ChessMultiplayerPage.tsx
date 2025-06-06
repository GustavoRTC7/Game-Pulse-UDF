import React, { useState, useCallback, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Trophy, Users, RotateCcw, MessageSquare, Copy, Share } from 'lucide-react';
import { chessSocket, ChessPlayer, GameState } from '../services/chessSocket';

const ChessMultiplayerPage: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isInRoom, setIsInRoom] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [playerColor, setPlayerColor] = useState<'white' | 'black' | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  // Conectar ao servidor
  const connectToServer = async () => {
    if (!username.trim()) {
      alert('Por favor, digite seu nome de usuário');
      return;
    }

    setConnectionStatus('connecting');
    try {
      await chessSocket.connect(username);
      setIsConnected(true);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Erro ao conectar:', error);
      setConnectionStatus('disconnected');
      alert('Erro ao conectar ao servidor. Verifique se o servidor está rodando.');
    }
  };

  // Entrar em uma sala
  const joinRoom = () => {
    if (!roomId.trim()) {
      alert('Por favor, digite o ID da sala');
      return;
    }

    chessSocket.joinRoom(roomId, { username });
  };

  // Criar nova sala
  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(newRoomId);
    chessSocket.joinRoom(newRoomId, { username });
  };

  // Fazer movimento
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (!gameState || gameState.gameState !== 'playing') {
      return false;
    }

    if (gameState.currentTurn !== playerColor) {
      return false;
    }

    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // sempre promover para rainha
    };

    chessSocket.makeMove(move);
    return true;
  };

  // Enviar mensagem
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    chessSocket.sendMessage(newMessage);
    setNewMessage('');
  };

  // Copiar ID da sala
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert('ID da sala copiado!');
  };

  // Compartilhar sala
  const shareRoom = () => {
    const shareText = `Venha jogar xadrez comigo! Sala: ${roomId}\nAcesse: ${window.location.origin}`;
    if (navigator.share) {
      navigator.share({
        title: 'GamePulse - Partida de Xadrez',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Link da sala copiado!');
    }
  };

  // Setup dos event listeners
  useEffect(() => {
    chessSocket.on('playerJoined', (data) => {
      setGameState(data.gameState);
      if (data.playerData.username === username) {
        setPlayerColor(data.playerData.color);
      }
      setIsInRoom(true);
    });

    chessSocket.on('gameStarted', (data) => {
      setGameState(data);
      setGame(new Chess(data.fen));
    });

    chessSocket.on('moveMade', (data) => {
      setGameState(data.gameState);
      setGame(new Chess(data.fen));
    });

    chessSocket.on('chatMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    chessSocket.on('playerLeft', (data) => {
      setGameState(data.gameState);
      alert('O outro jogador saiu da partida');
    });

    chessSocket.on('roomFull', () => {
      alert('Sala está cheia!');
    });

    chessSocket.on('moveError', (data) => {
      alert(`Erro no movimento: ${data.error}`);
    });

    return () => {
      chessSocket.disconnect();
    };
  }, [username]);

  // Renderizar tela de conexão
  if (!isConnected) {
    return (
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-bold text-white text-center">Chess Multiplayer</h1>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Seu nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu nome..."
                fullWidth
              />
              <Button
                onClick={connectToServer}
                fullWidth
                isLoading={connectionStatus === 'connecting'}
                disabled={!username.trim()}
              >
                {connectionStatus === 'connecting' ? 'Conectando...' : 'Conectar ao Servidor'}
              </Button>
              
              <div className="text-center text-sm text-gray-400">
                <p>Certifique-se de que o servidor está rodando</p>
                <p>Porta padrão: 3001</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Renderizar tela de sala
  if (!isInRoom) {
    return (
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-bold text-white text-center">Entrar em Sala</h1>
              <p className="text-gray-400 text-center">Olá, {username}!</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="ID da Sala"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                placeholder="Digite o ID da sala..."
                fullWidth
              />
              <Button onClick={joinRoom} fullWidth disabled={!roomId.trim()}>
                Entrar na Sala
              </Button>
              
              <div className="text-center text-gray-400">ou</div>
              
              <Button onClick={createRoom} variant="outline" fullWidth>
                Criar Nova Sala
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Chess Multiplayer</h1>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-gray-400">Sala: {roomId}</p>
          <Button variant="ghost" size="sm" onClick={copyRoomId}>
            <Copy size={16} className="mr-1" />
            Copiar
          </Button>
          <Button variant="ghost" size="sm" onClick={shareRoom}>
            <Share size={16} className="mr-1" />
            Compartilhar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              {gameState?.gameState === 'waiting' ? (
                <div className="text-center py-8">
                  <h2 className="text-xl font-bold text-white mb-4">Aguardando outro jogador...</h2>
                  <p className="text-gray-400">Compartilhe o ID da sala: <strong>{roomId}</strong></p>
                  <div className="mt-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-800 text-yellow-200">
                      <Users size={16} className="mr-2" />
                      {Object.keys(gameState.players).length}/2 jogadores
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-white">
                      <p>Você é: <strong className={playerColor === 'white' ? 'text-gray-300' : 'text-gray-800'}>{playerColor === 'white' ? 'Brancas' : 'Pretas'}</strong></p>
                      <p>Turno: <strong>{gameState?.currentTurn === 'white' ? 'Brancas' : 'Pretas'}</strong></p>
                    </div>
                    <div className="flex gap-2">
                      {gameState?.gameState === 'finished' && (
                        <Button variant="outline\" onClick={() => window.location.reload()}>
                          <RotateCcw size={16} className="mr-2" />
                          Nova Partida
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <Chessboard
                    position={gameState?.fen || game.fen()}
                    onPieceDrop={onDrop}
                    boardOrientation={playerColor || 'white'}
                    customBoardStyle={{
                      borderRadius: '4px',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                    }}
                  />
                  
                  {gameState?.gameState === 'finished' && (
                    <div className="mt-4 text-center">
                      <div className="bg-purple-800 text-white p-4 rounded-lg">
                        <h3 className="text-xl font-bold">Jogo Finalizado!</h3>
                        {game.isCheckmate() && (
                          <p>Xeque-mate! Vencedor: {game.turn() === 'w' ? 'Pretas' : 'Brancas'}</p>
                        )}
                        {game.isDraw() && <p>Empate!</p>}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-white flex items-center">
                <MessageSquare size={20} className="mr-2" />
                Chat
              </h2>
            </CardHeader>
            <CardContent>
              <div className="h-64 overflow-y-auto mb-4 space-y-2">
                {messages.map((message) => (
                  <div key={message.id} className="text-sm">
                    <span className="text-purple-400 font-medium">{message.username}: </span>
                    <span className="text-white">{message.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Digite uma mensagem..."
                  className="flex-1"
                />
                <Button onClick={sendMessage} size="sm">
                  Enviar
                </Button>
              </div>
            </CardContent>
          </Card>

          {gameState && (
            <Card className="mt-4">
              <CardHeader>
                <h3 className="text-lg font-bold text-white">Jogadores</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.values(gameState.players).map((player: ChessPlayer, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-white">{player.username}</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        player.color === 'white' ? 'bg-gray-300 text-gray-800' : 'bg-gray-800 text-white'
                      }`}>
                        {player.color === 'white' ? 'Brancas' : 'Pretas'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChessMultiplayerPage;