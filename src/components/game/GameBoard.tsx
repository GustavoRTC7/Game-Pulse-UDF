import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const GameBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { buttonPlayers, ball, selectPlayer, movePlayer, kickBall } = useGameStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw field
    ctx.fillStyle = '#2c8a3d';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw lines
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    
    // Center line
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 50, 0, Math.PI * 2);
    ctx.stroke();

    // Draw players
    buttonPlayers.forEach((player) => {
      ctx.beginPath();
      ctx.fillStyle = player.team === 'home' ? '#ff0000' : '#0000ff';
      ctx.strokeStyle = player.selected ? '#ffff00' : '#ffffff';
      ctx.lineWidth = player.selected ? 3 : 1;
      ctx.arc(player.position.x, player.position.y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Draw ball
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.arc(ball.position.x, ball.position.y, 8, 0, Math.PI * 2);
    ctx.fill();
  }, [buttonPlayers, ball]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on a player
    const clickedPlayer = buttonPlayers.find((player) => {
      const dx = player.position.x - x;
      const dy = player.position.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 15;
    });

    if (clickedPlayer) {
      selectPlayer(clickedPlayer.id);
    } else {
      // Move selected player or kick ball
      const selectedPlayer = buttonPlayers.find((p) => p.selected);
      if (selectedPlayer) {
        movePlayer({ x, y });
      }
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-900 p-4">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={handleCanvasClick}
        className="border-4 border-gray-700 rounded-lg"
      />
    </div>
  );
};

export default GameBoard;