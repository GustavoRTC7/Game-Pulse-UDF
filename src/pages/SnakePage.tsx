import React from 'react';
import Snake from '../components/games/Snake';

const SnakePage: React.FC = () => {
  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Snake Game</h1>
        <p className="text-gray-400">Use as setas do teclado para mover a cobra e coletar a comida</p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <Snake />
      </div>
    </div>
  );
};

export default SnakePage;