import React from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import LeaderboardTable from '../components/LeaderboardTable';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Search, Trophy, Medal, Award, Users } from 'lucide-react';

const LeaderboardPage: React.FC = () => {
  const { 
    leaderboard, 
    searchQuery, 
    setSearchQuery, 
    sortLeaderboard,
    sortBy,
    setSortBy
  } = useApp();
  const { t } = useTranslation();
  
  const filteredLeaderboard = searchQuery 
    ? leaderboard.filter(entry => 
        entry.username.toLowerCase().includes(searchQuery.toLowerCase())
      ) 
    : leaderboard;
  
  const sortedLeaderboard = sortLeaderboard(filteredLeaderboard, sortBy);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Trophy size={24} className="text-yellow-400 mr-2" /> 
            {t('leaderboard.globalLeaderboard')}
          </h1>
          <p className="text-gray-400 mt-1">See how you stack up against the best players worldwide</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={handleSearch}
            leftIcon={<Search size={18} />}
            className="w-full md:w-64"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-xl p-6 flex items-center">
          <div className="bg-yellow-500 p-3 rounded-full mr-4">
            <Trophy size={24} className="text-yellow-900" />
          </div>
          <div>
            <div className="text-yellow-200 text-sm">{t('leaderboard.rank')} #1</div>
            <div className="text-white font-bold text-xl">{leaderboard[0].username}</div>
            <div className="text-yellow-100 text-sm">{t('leaderboard.winRate')}: {leaderboard[0].winRate.toFixed(1)}%</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl p-6 flex items-center">
          <div className="bg-gray-400 p-3 rounded-full mr-4">
            <Medal size={24} className="text-gray-800" />
          </div>
          <div>
            <div className="text-gray-300 text-sm">{t('leaderboard.rank')} #2</div>
            <div className="text-white font-bold text-xl">{leaderboard[1].username}</div>
            <div className="text-gray-200 text-sm">{t('leaderboard.winRate')}: {leaderboard[1].winRate.toFixed(1)}%</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-xl p-6 flex items-center">
          <div className="bg-amber-500 p-3 rounded-full mr-4">
            <Award size={24} className="text-amber-900" />
          </div>
          <div>
            <div className="text-amber-200 text-sm">{t('leaderboard.rank')} #3</div>
            <div className="text-white font-bold text-xl">{leaderboard[2].username}</div>
            <div className="text-amber-100 text-sm">{t('leaderboard.winRate')}: {leaderboard[2].winRate.toFixed(1)}%</div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant={sortBy === 'rank' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setSortBy('rank')}
          >
            {t('leaderboard.rank')}
          </Button>
          <Button 
            variant={sortBy === 'level' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setSortBy('level')}
          >
            {t('leaderboard.level')}
          </Button>
          <Button 
            variant={sortBy === 'wins' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setSortBy('wins')}
          >
            {t('leaderboard.wins')}
          </Button>
          <Button 
            variant={sortBy === 'winRate' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setSortBy('winRate')}
          >
            {t('leaderboard.winRate')}
          </Button>
        </div>
        
        <LeaderboardTable 
          data={sortedLeaderboard} 
          onSort={setSortBy}
          sortBy={sortBy}
        />
      </div>
      
      <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-purple-500 border-opacity-50">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-4 md:mb-0 md:mr-6">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <Users size={32} className="text-white" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-1">Join Ranked Tournaments</h3>
            <p className="text-gray-400 mb-4">Compete in weekly tournaments to climb the leaderboard faster</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition">
              View Tournaments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;