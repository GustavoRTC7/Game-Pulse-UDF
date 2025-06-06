import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import Avatar from '../components/ui/Avatar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Search, UserPlus, MessageSquare, X, Users } from 'lucide-react';

const FriendsPage: React.FC = () => {
  const { currentUser, users, searchQuery, setSearchQuery } = useApp();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  
  // All friends
  const friends = users.filter(user => 
    currentUser.friends.includes(user.id)
  );
  
  // Online friends
  const onlineFriends = friends.filter(user => 
    user.status !== 'offline'
  );
  
  // Filter friends based on search
  const filteredFriends = searchQuery 
    ? friends.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      ) 
    : friends;
  
  // Filter based on active tab
  const displayedFriends = activeTab === 'online' 
    ? onlineFriends 
    : filteredFriends;
  
  // Get suggested friends (not friends and not current user)
  const suggestedFriends = users.filter(user => 
    !currentUser.friends.includes(user.id) && user.id !== currentUser.id
  );
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const statusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'in-game':
        return 'In Game';
      default:
        return status;
    }
  };
  
  return (
    <div className="px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Users size={24} className="text-purple-400 mr-2" /> 
            {t('friends.allFriends')}
          </h1>
          <p className="text-gray-400 mt-1">Connect, play and chat with your friends</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Input
            type="text"
            placeholder={t('friends.searchFriends')}
            value={searchQuery}
            onChange={handleSearch}
            leftIcon={<Search size={18} />}
            className="w-full md:w-64"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-4 flex border-b border-gray-700">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'all'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('all')}
            >
              {t('friends.allFriends')} ({friends.length})
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'online'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('online')}
            >
              {t('friends.onlineFriends')} ({onlineFriends.length})
            </button>
          </div>
          
          {displayedFriends.length > 0 ? (
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <ul className="divide-y divide-gray-700">
                {displayedFriends.map(friend => (
                  <li key={friend.id} className="p-4 hover:bg-gray-750">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar 
                          src={friend.avatar} 
                          alt={friend.username}
                          status={friend.status}
                          size="md"
                        />
                        <div className="ml-4">
                          <div className="text-white font-medium">{friend.username}</div>
                          <div className="text-sm text-gray-400">
                            Level {friend.level} • {friend.rank} • {statusText(friend.status)}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-gray-400 hover:text-white"
                        >
                          <MessageSquare size={18} />
                        </Button>
                        {friend.status === 'in-game' && (
                          <Button variant="primary" size="sm">
                            Join Game
                          </Button>
                        )}
                        {friend.status === 'online' && (
                          <Button variant="primary" size="sm">
                            Invite
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X size={18} />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <h3 className="text-xl font-medium text-white mb-2">No friends found</h3>
              <p className="text-gray-400">
                {activeTab === 'online' 
                  ? "None of your friends are online right now." 
                  : "Try adding some friends to your list."}
              </p>
            </div>
          )}
        </div>
        
        <div>
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white">{t('friends.suggestedFriends')}</h3>
            </div>
            
            <ul className="divide-y divide-gray-700">
              {suggestedFriends.map(user => (
                <li key={user.id} className="p-4 hover:bg-gray-750">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar 
                        src={user.avatar} 
                        alt={user.username}
                        status={user.status}
                        size="md"
                      />
                      <div className="ml-3">
                        <p className="text-white font-medium">{user.username}</p>
                        <p className="text-xs text-gray-400">Level {user.level} • {user.rank}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center"
                    >
                      <UserPlus size={14} className="mr-1" />
                      {t('friends.addFriend')}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-purple-500 border-opacity-50">
            <h3 className="text-lg font-bold text-white mb-3">Find Players</h3>
            <Input
              type="text"
              placeholder="Search by username..."
              leftIcon={<Search size={18} />}
              className="mb-4"
            />
            <Button variant="primary" fullWidth>
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;