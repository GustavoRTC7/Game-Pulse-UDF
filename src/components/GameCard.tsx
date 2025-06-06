import React from 'react';
import { Users, MapPin, Signal, Award, Bot } from 'lucide-react';
import { Game } from '../types';
import Card, { CardContent } from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

interface GameCardProps {
  game: Game;
  onPlay?: (mode: 'multiplayer' | 'bot') => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="success">Open</Badge>;
      case 'in-progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'finished':
        return <Badge variant="error">Finished</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getSkillBadge = (level: string) => {
    switch (level) {
      case 'beginner':
        return <Badge variant="info" className="bg-green-800">Beginner</Badge>;
      case 'intermediate':
        return <Badge variant="info" className="bg-blue-800">Intermediate</Badge>;
      case 'advanced':
        return <Badge variant="info" className="bg-purple-800">Advanced</Badge>;
      case 'pro':
        return <Badge variant="info" className="bg-red-800">Pro</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getBotDifficultyBadge = (difficulty?: string) => {
    if (!difficulty) return null;
    switch (difficulty) {
      case 'easy':
        return <Badge variant="success">Bot: Easy</Badge>;
      case 'medium':
        return <Badge variant="warning">Bot: Medium</Badge>;
      case 'hard':
        return <Badge variant="error">Bot: Hard</Badge>;
      default:
        return null;
    }
  };

  // Check if game supports multiplayer
  const supportsMultiplayer = game.id === 'chess';

  return (
    <Card hover className="h-full flex flex-col">
      <div className="relative">
        <img 
          src={game.thumbnail} 
          alt={game.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {getStatusBadge(game.status)}
          {getSkillBadge(game.skillLevel)}
          {game.botAvailable && getBotDifficultyBadge(game.botDifficulty)}
        </div>
      </div>
      <CardContent className="flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
        
        <div className="space-y-2 mb-4 flex-grow">
          <div className="flex items-center text-gray-400">
            <Users size={16} className="mr-2" />
            <span>{game.players.current}/{game.players.max} Players</span>
          </div>
          <div className="flex items-center text-gray-400">
            <MapPin size={16} className="mr-2" />
            <span>{game.map}</span>
          </div>
          <div className="flex items-center text-gray-400">
            <Signal size={16} className="mr-2" />
            <span>{game.ping}ms</span>
          </div>
          <div className="flex items-center text-gray-400">
            <Award size={16} className="mr-2" />
            <span>{game.mode}</span>
          </div>
        </div>
        
        <div className="mt-auto space-y-2">
          {game.botAvailable && (
            <Button 
              variant="outline" 
              fullWidth
              onClick={() => onPlay?.('bot')}
              className="flex items-center justify-center"
            >
              <Bot size={16} className="mr-2" />
              Play vs Bot
            </Button>
          )}
          {supportsMultiplayer && (
            <Button 
              variant={game.status === 'open' ? 'primary' : 'outline'} 
              fullWidth
              onClick={() => onPlay?.('multiplayer')}
              disabled={game.status !== 'open'}
            >
              {game.status === 'open' ? 'Play Multiplayer' : 'Spectate'}
            </Button>
          )}
          {!supportsMultiplayer && (
            <Button 
              variant="primary" 
              fullWidth
              onClick={() => onPlay?.('bot')}
            >
              Play Game
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;