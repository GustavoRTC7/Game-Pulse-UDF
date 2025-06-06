import React from 'react';
import Hangman from '../components/games/Hangman';

const HangmanPage: React.FC = () => {
  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Jogo da Forca</h1>
        <p className="text-gray-400">Adivinhe a palavra escolhendo as letras corretas</p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <Hangman />
      </div>
    </div>
  );
};

export default HangmanPage;