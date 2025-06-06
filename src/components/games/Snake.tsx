import React, { useState, useEffect, useCallback } from 'react';
import Button from '../ui/Button';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_GAME_SPEED = 150;
const MIN_GAME_SPEED = 50; // Maximum speed (minimum delay)
const SPEED_INCREASE_FACTOR = 0.95; // 5% faster each time

const Snake: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(INITIAL_GAME_SPEED);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(INITIAL_FOOD);
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setGameSpeed(INITIAL_GAME_SPEED);
  };

  const checkCollision = (head: { x: number; y: number }) => {
    if (
      head.x < 0 || head.x >= GRID_SIZE ||
      head.y < 0 || head.y >= GRID_SIZE
    ) {
      return true;
    }

    for (let segment of snake.slice(1)) {
      if (head.x === segment.x && head.y === segment.y) {
        return true;
      }
    }
    return false;
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    const newSnake = [...snake];
    const head = {
      x: newSnake[0].x + direction.x,
      y: newSnake[0].y + direction.y
    };

    if (checkCollision(head)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setScore(prev => prev + 10);
      setFood(generateFood());
      // Increase speed when food is eaten, but don't exceed maximum speed
      setGameSpeed(prev => Math.max(MIN_GAME_SPEED, prev * SPEED_INCREASE_FACTOR));
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    const gameInterval = setInterval(moveSnake, gameSpeed);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(gameInterval);
    };
  }, [direction, gameOver, moveSnake, gameSpeed]);

  return (
    <div className="flex flex-col items-center bg-gray-800 p-6 rounded-xl">
      <div className="mb-4 flex justify-between w-full">
        <div className="text-purple-400">Score: {score}</div>
        <div className="text-purple-400">Speed: {Math.round((1 / gameSpeed) * 1000)}x</div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsPaused(prev => !prev)}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
      </div>
      
      <div 
        className="border-2 border-purple-500 rounded-lg overflow-hidden"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          position: 'relative'
        }}
      >
        {snake.map((segment, i) => (
          <div
            key={i}
            className="absolute bg-purple-500"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              borderRadius: i === 0 ? '4px' : '2px'
            }}
          />
        ))}
        <div
          className="absolute bg-red-500"
          style={{
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            borderRadius: '50%'
          }}
        />
      </div>

      {gameOver && (
        <div className="mt-4 text-center">
          <p className="text-red-500 mb-2">Game Over!</p>
          <Button onClick={resetGame}>Play Again</Button>
        </div>
      )}

      <div className="mt-4 text-gray-400 text-sm">
        Use arrow keys to move • Space to pause
      </div>
    </div>
  );
};

export default Snake;