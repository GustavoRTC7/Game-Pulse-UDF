import React, { useState } from 'react';
import { Search, Bell, MessageSquare } from 'lucide-react';
import Avatar from './ui/Avatar';
import Input from './ui/Input';
import { useApp } from '../context/AppContext';

const Navbar: React.FC = () => {
  const { currentUser, setSearchQuery, setActiveTab } = useApp();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleProfileClick = () => {
    setActiveTab('profile');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-between">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search games, players..." 
                onChange={handleSearch}
                leftIcon={<Search size={18} />} 
                className="w-64"
              />
            </div>
            
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white mr-2">
                <Bell size={20} />
              </button>
              
              <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white mr-4">
                <MessageSquare size={20} />
              </button>
              
              <div 
                className="flex items-center cursor-pointer hover:bg-gray-800 rounded-lg p-2 transition-colors"
                onClick={handleProfileClick}
              >
                <Avatar 
                  src={currentUser.avatar} 
                  alt={currentUser.username}
                  status={currentUser.status}
                  size="sm"
                />
                <div className="ml-2">
                  <p className="text-sm font-medium text-white">{currentUser.username}</p>
                  <p className="text-xs text-gray-400">Level {currentUser.level}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;