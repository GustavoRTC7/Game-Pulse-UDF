import React, { useEffect, useRef } from 'react';
import { Engine, Render, World, Bodies, Body, Events, Mouse, MouseConstraint } from 'matter-js';
import { useGameStore } from '../../store/gameStore';
import { socket } from '../../services/socket';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const BUTTON_RADIUS = 15;
const BALL_RADIUS = 10;

const ButtonFootball: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine>();
  const { updateGameState, gameStatus, currentTurn, buttonPlayers, ball } = useGameStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup Matter.js engine
    const engine = Engine.create({
      gravity: { x: 0, y: 0 }
    });
    engineRef.current = engine;

    // Create renderer
    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        wireframes: false,
        background: '#2c8a3d'
      }
    });

    // Create field boundaries
    const walls = [
      Bodies.rectangle(CANVAS_WIDTH/2, 0, CANVAS_WIDTH, 20, { isStatic: true }), // Top
      Bodies.rectangle(CANVAS_WIDTH/2, CANVAS_HEIGHT, CANVAS_WIDTH, 20, { isStatic: true }), // Bottom
      Bodies.rectangle(0, CANVAS_HEIGHT/2, 20, CANVAS_HEIGHT, { isStatic: true }), // Left
      Bodies.rectangle(CANVAS_WIDTH, CANVAS_HEIGHT/2, 20, CANVAS_HEIGHT, { isStatic: true }) // Right
    ];

    // Create goals
    const goalWidth = 120;
    const goalDepth = 40;
    const goals = [
      // Left goal
      Bodies.rectangle(-goalDepth/2, CANVAS_HEIGHT/2, goalDepth, goalWidth, { 
        isStatic: true,
        render: { fillStyle: '#ffffff' }
      }),
      // Right goal
      Bodies.rectangle(CANVAS_WIDTH + goalDepth/2, CANVAS_HEIGHT/2, goalDepth, goalWidth, { 
        isStatic: true,
        render: { fillStyle: '#ffffff' }
      })
    ];

    // Create ball
    const ballBody = Bodies.circle(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, BALL_RADIUS, {
      restitution: 0.8,
      friction: 0.005,
      render: {
        fillStyle: '#ffffff'
      }
    });

    // Create players
    const players = buttonPlayers.map(player => {
      return Bodies.circle(player.position.x, player.position.y, BUTTON_RADIUS, {
        render: {
          fillStyle: player.team === 'home' ? '#ff0000' : '#0000ff'
        }
      });
    });

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    // Add all bodies to world
    World.add(engine.world, [...walls, ...goals, ballBody, ...players, mouseConstraint]);

    // Handle collisions
    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        
        // Check for goal collisions
        if (goals.includes(bodyA) || goals.includes(bodyB)) {
          const goalSide = bodyA === goals[0] || bodyB === goals[0] ? 'left' : 'right';
          socket.emit('goal', { side: goalSide });
        }
      });
    });

    // Start engine and renderer
    Engine.run(engine);
    Render.run(render);

    // Socket events
    socket.on('gameUpdate', (newState) => {
      updateGameState(newState);
    });

    return () => {
      Render.stop(render);
      Engine.clear(engine);
      socket.off('gameUpdate');
    };
  }, []);

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        className="border-4 border-gray-700 rounded-lg mx-auto"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      {gameStatus === 'waiting' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-2xl">Aguardando oponente...</div>
        </div>
      )}
    </div>
  );
};

export default ButtonFootball;