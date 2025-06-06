import React from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import GameCard from '../components/GameCard';
import FriendsList from '../components/FriendsList';
import PlayerStats from '../components/PlayerStats';
import Snake from '../components/games/Snake';
import Hangman from '../components/games/Hangman';
import { ArrowRight, Gamepad2 } from 'lucide-react';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const { currentUser, users, setActiveTab } = useApp();
  const { t } = useTranslation();
  
  return (
    <div className="px-4 py-6 space-y-8">
      <h1 className="text-2xl font-bold text-white">
        {t('home.welcome', { username: currentUser.username })}
      </h1>
      
      <PlayerStats user={currentUser} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">{t('home.featuredGames')}</h2>
              <button 
                onClick={() => setActiveTab('games')}
                className="text-purple-400 flex items-center text-sm hover:underline"
              >
                {t('home.viewAll')} <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer transform transition-all hover:scale-[1.02]"
                onClick={() => setActiveTab('snake')}
              >
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">Snake Game</h3>
                  <Button 
                    variant="primary"
                    size="sm"
                    className="flex items-center"
                  >
                    <Gamepad2 size={16} className="mr-1" />
                    {t('games.playVsBot')}
                  </Button>
                </div>
                <div className="p-4">
                  <img 
                    src="https://images.pexels.com/photos/207983/pexels-photo-207983.jpeg?auto=compress&cs=tinysrgb&w=500"
                    alt="Snake Game"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              </div>
              <div 
                className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer transform transition-all hover:scale-[1.02]"
                onClick={() => setActiveTab('hangman')}
              >
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">Hangman</h3>
                  <Button 
                    variant="primary"
                    size="sm"
                    className="flex items-center"
                  >
                    <Gamepad2 size={16} className="mr-1" />
                    {t('games.playVsBot')}
                  </Button>
                </div>
                <div className="p-4">
                  <img 
                    src="https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=500"
                    alt="Hangman"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">{t('home.recentActivity')}</h2>
              <a href="#" className="text-purple-400 flex items-center text-sm hover:underline">
                {t('home.viewAll')} <ArrowRight size={16} className="ml-1" />
              </a>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-800 rounded-lg p-4 flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-purple-700 flex items-center justify-center mr-4">
                    <span className="text-white font-bold">{i}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {i === 1 ? 'New high score in Snake Game!' : 
                       i === 2 ? 'Won a game of Hangman' : 
                       'Started playing Snake Game'}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {i === 1 ? '2 hours ago' : 
                       i === 2 ? 'Yesterday' : 
                       '2 days ago'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <FriendsList currentUser={currentUser} users={users} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;