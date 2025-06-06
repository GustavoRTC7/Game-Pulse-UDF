import React from 'react';
import { useGameStore } from '../../store/gameStore';
import Button from '../ui/Button';

const GameControls: React.FC = () => {
  const { gameStatus, currentTurn, timeRemaining, score } = useGameStore();

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="text-red-500 font-bold text-2xl">{score.home}</div>
        <div className="text-white font-medium">
          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </div>
        <div className="text-blue-500 font-bold text-2xl">{score.away}</div>
      </div>
      
      <div className="flex justify-center gap-4">
        <Button
          variant={currentTurn === 'home' ? 'primary' : 'ghost'}
          disabled={gameStatus !== 'playing'}
        >
          Red Team
        </Button>
        <Button
          variant={currentTurn === 'away' ? 'primary' : 'ghost'}
          disabled={gameStatus !== 'playing'}
        >
          Blue Team
        </Button>
      </div>
    </div>
  );
};

export default GameControls;