import React, { useState, useCallback, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Trophy, Notebook as Robot, Users, RotateCcw, Wifi } from 'lucide-react';

const ChessPage: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [gameMode, setGameMode] = useState<'bot' | 'multiplayer' | 'online' | null>(null);
  const [botDifficulty, setBotDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  // Function to make a move
  const makeMove = useCallback((move: any) => {
    try {
      const result = game.move(move);
      if (result) {
        setGame(new Chess(game.fen()));
        setMoveHistory(prev => [...prev, game.history().slice(-1)[0]]);
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }, [game]);

  // Function to handle piece drop
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // always promote to queen for simplicity
    });

    // If move is valid and we're playing against bot, make bot move
    if (move && gameMode === 'bot') {
      // Simple bot implementation - random legal moves
      setTimeout(() => {
        const moves = game.moves();
        if (moves.length > 0) {
          const randomMove = moves[Math.floor(Math.random() * moves.length)];
          makeMove(game.move(randomMove));
        }
      }, 300);
    }

    return move;
  };

  // Reset game
  const resetGame = () => {
    setGame(new Chess());
    setMoveHistory([]);
  };

  // Navigate to online multiplayer
  const goToOnlineMode = () => {
    // This would be handled by your app's routing system
    window.location.hash = '#chess-multiplayer';
    // Or if using React Router: navigate('/chess-multiplayer');
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Chess</h1>
        <p className="text-gray-400">Play chess against a bot, locally, or online with other players</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {!gameMode ? (
                <div className="text-center space-y-4">
                  <h2 className="text-xl font-bold text-white mb-6">Select Game Mode</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => setGameMode('bot')}
                      className="flex flex-col items-center justify-center p-6 h-24"
                    >
                      <Robot size={24} className="mb-2" />
                      Play vs Bot
                    </Button>
                    <Button
                      onClick={() => setGameMode('multiplayer')}
                      className="flex flex-col items-center justify-center p-6 h-24"
                    >
                      <Users size={24} className="mb-2" />
                      Local Multiplayer
                    </Button>
                    <Button
                      onClick={goToOnlineMode}
                      variant="secondary"
                      className="flex flex-col items-center justify-center p-6 h-24"
                    >
                      <Wifi size={24} className="mb-2" />
                      Online Multiplayer
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      {gameMode === 'bot' && (
                        <select
                          value={botDifficulty}
                          onChange={(e) => setBotDifficulty(e.target.value as any)}
                          className="bg-gray-800 text-white rounded-lg px-3 py-2 mr-4"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      )}
                      <span className="text-white">
                        Mode: {gameMode === 'bot' ? 'vs Bot' : 'Local Multiplayer'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setGameMode(null)}
                      >
                        Change Mode
                      </Button>
                      <Button
                        variant="outline"
                        onClick={resetGame}
                        className="flex items-center"
                      >
                        <RotateCcw size={16} className="mr-2" />
                        New Game
                      </Button>
                    </div>
                  </div>
                  <Chessboard
                    position={game.fen()}
                    onPieceDrop={onDrop}
                    customBoardStyle={{
                      borderRadius: '4px',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                    }}
                  />
                  
                  {(game.isGameOver()) && (
                    <div className="mt-4 text-center">
                      <div className="bg-purple-800 text-white p-4 rounded-lg">
                        <h3 className="text-xl font-bold">Game Over!</h3>
                        {game.isCheckmate() && (
                          <p>Checkmate! Winner: {game.turn() === 'w' ? 'Black' : 'White'}</p>
                        )}
                        {game.isDraw() && <p>It's a draw!</p>}
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
                <Trophy size={20} className="mr-2" />
                Move History
              </h2>
            </CardHeader>
            <CardContent>
              {moveHistory.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {moveHistory.map((move, index) => (
                    <div key={index} className="flex items-center text-gray-300">
                      <span className="w-8 text-gray-500">{index + 1}.</span>
                      <span>{move}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No moves yet</p>
              )}
            </CardContent>
          </Card>

          {!gameMode && (
            <Card className="mt-4">
              <CardHeader>
                <h3 className="text-lg font-bold text-white">Game Modes</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-white">vs Bot:</strong>
                    <p className="text-gray-400">Play against AI with different difficulty levels</p>
                  </div>
                  <div>
                    <strong className="text-white">Local Multiplayer:</strong>
                    <p className="text-gray-400">Play with someone on the same device</p>
                  </div>
                  <div>
                    <strong className="text-white">Online Multiplayer:</strong>
                    <p className="text-gray-400">Play with friends over the internet</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChessPage;