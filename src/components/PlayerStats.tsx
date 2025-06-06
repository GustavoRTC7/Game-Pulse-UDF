import React from 'react';
import { User } from '../types';
import Card, { CardContent } from './ui/Card';
import Avatar from './ui/Avatar';
import { Trophy, Star, Calendar, Clock } from 'lucide-react';

interface PlayerStatsProps {
  user: User;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ user }) => {
  return (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <div className="relative">
            <Avatar 
              src={user.avatar} 
              alt={user.username}
              size="xl"
              status={user.status}
              className="border-4 border-purple-600"
            />
            <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {user.level}
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white">{user.username}</h2>
            <div className="flex items-center justify-center md:justify-start mt-1">
              <Trophy size={16} className="text-yellow-400 mr-1" />
              <span className="text-gray-300 text-sm">{user.rank} Rank</span>
            </div>
            
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-gray-400 text-xs mb-1 flex items-center">
                  <Star size={12} className="mr-1" />
                  Win Rate
                </div>
                <div className="text-white font-bold text-lg">{user.winRate.toFixed(1)}%</div>
              </div>
              
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-gray-400 text-xs mb-1 flex items-center">
                  <Calendar size={12} className="mr-1" />
                  Matches
                </div>
                <div className="text-white font-bold text-lg">{user.totalMatches}</div>
              </div>
              
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-green-400 text-xs mb-1">Wins</div>
                <div className="text-white font-bold text-lg">{user.wins}</div>
              </div>
              
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-red-400 text-xs mb-1">Losses</div>
                <div className="text-white font-bold text-lg">{user.losses}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg flex items-center">
            <Clock size={20} className="text-purple-400 mr-3" />
            <div>
              <div className="text-gray-400 text-xs">Recent Activity</div>
              <div className="text-white text-sm">Last played 2 hours ago</div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg flex items-center">
            <Trophy size={20} className="text-yellow-400 mr-3" />
            <div>
              <div className="text-gray-400 text-xs">Highest Achievement</div>
              <div className="text-white text-sm">Regional Champion</div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg flex items-center">
            <Star size={20} className="text-blue-400 mr-3" />
            <div>
              <div className="text-gray-400 text-xs">Favorite Game</div>
              <div className="text-white text-sm">Team Deathmatch</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerStats;