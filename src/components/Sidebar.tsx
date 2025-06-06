import React from 'react';
import { Home, Gamepad, Trophy, Users, Settings, LogOut, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const menuItems = [
    { id: 'home', label: 'Home', icon: <Home size={20} /> },
    { id: 'games', label: 'Games', icon: <Gamepad size={20} /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={20} /> },
    { id: 'friends', label: 'Friends', icon: <Users size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
  ];

  return (
    <div className="hidden md:flex flex-col h-screen w-64 bg-gray-900 border-r border-gray-800">
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <span className="text-white text-xl font-bold">Game<span className="text-purple-500">Pulse</span></span>
      </div>
      <div className="flex flex-col flex-grow p-4 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-purple-700 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
          <LogOut size={20} className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;