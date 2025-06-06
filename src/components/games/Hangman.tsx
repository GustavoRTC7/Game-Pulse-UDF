import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

const WORDS = {
  objects: [
    'CADEIRA', 'MESA', 'COMPUTADOR', 'TELEFONE', 'TELEVISÃO',
    'GELADEIRA', 'VENTILADOR', 'NOTEBOOK', 'CANETA', 'LÁPIS',
    'ALMOFADA', 'RELÓGIO', 'ARMÁRIO', 'ESTANTE', 'QUADRO'
  ],
  food: [
    'FEIJOADA', 'ACARAJÉ', 'BRIGADEIRO', 'COXINHA', 'TAPIOCA',
    'PAMONHA', 'MOQUECA', 'CHURRASCO', 'PINHÃO', 'AIPIM',
    'PAÇOCA', 'FAROFA', 'PICANHA', 'MORTADELA', 'PASTEL'
  ]
};

const MAX_TRIES = 6;

const HangmanDrawing: React.FC<{ wrongGuesses: number }> = ({ wrongGuesses }) => {
  return (
    <div className="relative w-48 h-48 mx-auto mb-8">
      {/* Base */}
      <div className="absolute bottom-0 w-32 h-2 bg-purple-500 left-1/2 transform -translate-x-1/2" />
      {/* Pole */}
      <div className="absolute bottom-0 w-2 h-40 bg-purple-500 left-1/2 transform -translate-x-1/2" />
      {/* Top */}
      <div className="absolute top-2 w-32 h-2 bg-purple-500 left-1/2 transform -translate-x-1/2" />
      {/* Rope */}
      <div className="absolute top-2 w-2 h-8 bg-purple-500 right-8" />
      
      {/* Head */}
      {wrongGuesses > 0 && (
        <div className="absolute top-10 right-6 w-8 h-8 rounded-full border-4 border-purple-500" />
      )}
      
      {/* Body */}
      {wrongGuesses > 1 && (
        <div className="absolute top-[4.5rem] right-[1.85rem] w-2 h-16 bg-purple-500" />
      )}
      
      {/* Left Arm */}
      {wrongGuesses > 2 && (
        <div className="absolute top-20 right-[1.85rem] w-12 h-2 bg-purple-500 origin-right rotate-45" />
      )}
      
      {/* Right Arm */}
      {wrongGuesses > 3 && (
        <div className="absolute top-20 right-[1.85rem] w-12 h-2 bg-purple-500 origin-left -rotate-45" />
      )}
      
      {/* Left Leg */}
      {wrongGuesses > 4 && (
        <div className="absolute top-[8.5rem] right-[1.85rem] w-12 h-2 bg-purple-500 origin-right rotate-45" />
      )}
      
      {/* Right Leg */}
      {wrongGuesses > 5 && (
        <div className="absolute top-[8.5rem] right-[1.85rem] w-12 h-2 bg-purple-500 origin-left -rotate-45" />
      )}
    </div>
  );
};

const Hangman: React.FC = () => {
  const [category, setCategory] = useState<'objects' | 'food'>('objects');
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const initGame = (selectedCategory: 'objects' | 'food') => {
    const wordList = WORDS[selectedCategory];
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setWord(randomWord);
    setCategory(selectedCategory);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameOver(false);
    setWon(false);
    setGameStarted(true);
  };

  const guessLetter = (letter: string) => {
    if (gameOver || won) return;

    const newGuessedLetters = new Set(guessedLetters);
    newGuessedLetters.add(letter);
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      if (newWrongGuesses >= MAX_TRIES) {
        setGameOver(true);
      }
    }

    const allLettersGuessed = word
      .split('')
      .every(char => newGuessedLetters.has(char));
    
    if (allLettersGuessed) {
      setWon(true);
    }
  };

  const renderWord = () => {
    return word.split('').map((letter, index) => (
      <span key={index} className="mx-1">
        <span className={`text-2xl font-bold ${guessedLetters.has(letter) ? 'text-purple-400' : 'text-gray-600'}`}>
          {guessedLetters.has(letter) ? letter : '_'}
        </span>
      </span>
    ));
  };

  const renderKeyboard = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÇÃÁÀÂÉÊÍÓÔÕÚ'.split('');
    return (
      <div className="grid grid-cols-7 gap-2">
        {alphabet.map(letter => (
          <Button
            key={letter}
            variant={guessedLetters.has(letter) ? 'ghost' : 'outline'}
            size="sm"
            disabled={guessedLetters.has(letter) || gameOver || won}
            onClick={() => guessLetter(letter)}
            className={`w-10 h-10 ${
              guessedLetters.has(letter) && !word.includes(letter)
                ? 'text-red-500'
                : guessedLetters.has(letter) && word.includes(letter)
                ? 'text-green-500'
                : ''
            }`}
          >
            {letter}
          </Button>
        ))}
      </div>
    );
  };

  const renderCategorySelection = () => {
    return (
      <div className="text-center">
        <h2 className="text-xl text-white mb-4">Escolha uma categoria:</h2>
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => initGame('objects')}
            className="w-32"
          >
            Objetos
          </Button>
          <Button
            variant="outline"
            onClick={() => initGame('food')}
            className="w-32"
          >
            Comidas
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center bg-gray-800 p-6 rounded-xl">
      {!gameStarted ? (
        renderCategorySelection()
      ) : (
        <>
          <div className="mb-6 text-center">
            <div className="text-purple-400 mb-2">
              Categoria: {category === 'objects' ? 'Objetos' : 'Comidas'}
            </div>
            <div className="text-purple-400 mb-2">
              Erros: {wrongGuesses} / {MAX_TRIES}
            </div>
            
            <HangmanDrawing wrongGuesses={wrongGuesses} />
            
            <div className="mb-4">{renderWord()}</div>
          </div>

          {renderKeyboard()}

          {(gameOver || won) && (
            <div className="mt-6 text-center">
              <p className={`text-xl mb-4 ${won ? 'text-green-500' : 'text-red-500'}`}>
                {won ? 'Parabéns! Você venceu!' : `Game Over! A palavra era ${word}`}
              </p>
              <div className="flex gap-4">
                <Button onClick={() => initGame(category)}>Jogar Novamente</Button>
                <Button variant="outline" onClick={() => setGameStarted(false)}>
                  Mudar Categoria
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Hangman;