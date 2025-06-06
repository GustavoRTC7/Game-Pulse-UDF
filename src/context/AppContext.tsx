import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Game, LeaderboardEntry } from '../types';
import { currentUser as initialCurrentUser, games, leaderboard, users } from '../data/mockData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  games: Game[];
  leaderboard: LeaderboardEntry[];
  users: User[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterGames: (games: Game[]) => Game[];
  sortLeaderboard: (leaderboard: LeaderboardEntry[], sortBy: string) => LeaderboardEntry[];
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  filterSkillLevel: string;
  setFilterSkillLevel: (level: string) => void;
  filterGameMode: string;
  setFilterGameMode: (mode: string) => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(initialCurrentUser);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rank');
  const [filterSkillLevel, setFilterSkillLevel] = useState('all');
  const [filterGameMode, setFilterGameMode] = useState('all');

  // Load saved user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Error loading saved user data:', error);
      }
    }
  }, []);

  const updateUserProfile = (updates: Partial<User>) => {
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const filterGames = (gamesArray: Game[]): Game[] => {
    return gamesArray.filter(game => {
      const searchFields = [
        game.title.toLowerCase(),
        game.mode.toLowerCase(),
        game.map.toLowerCase(),
        game.host.toLowerCase(),
        game.skillLevel.toLowerCase()
      ];

      const matchesSearch = searchQuery === '' || 
        searchFields.some(field => field.includes(searchQuery.toLowerCase()));

      const matchesSkill = filterSkillLevel === 'all' || game.skillLevel === filterSkillLevel;
      const matchesMode = filterGameMode === 'all' || game.mode === filterGameMode;

      return matchesSearch && matchesSkill && matchesMode;
    });
  };

  const sortLeaderboard = (leaderboardArray: LeaderboardEntry[], sortByField: string): LeaderboardEntry[] => {
    return [...leaderboardArray].sort((a, b) => {
      switch (sortByField) {
        case 'rank':
          return a.rank - b.rank;
        case 'level':
          return b.level - a.level;
        case 'wins':
          return b.wins - a.wins;
        case 'winRate':
          return b.winRate - a.winRate;
        default:
          return a.rank - b.rank;
      }
    });
  };

  const value = {
    currentUser,
    setCurrentUser,
    games,
    leaderboard,
    users,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filterGames,
    sortLeaderboard,
    sortBy,
    setSortBy,
    filterSkillLevel,
    setFilterSkillLevel,
    filterGameMode,
    setFilterGameMode,
    updateUserProfile
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};