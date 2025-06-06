import { User, Game, LeaderboardEntry, Match } from '../types';

export const currentUser: User = {
  id: 'user-1',
  username: 'ProGamer99',
  avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
  level: 42,
  rank: 'Diamond',
  totalMatches: 248,
  wins: 167,
  losses: 81,
  winRate: 67.3,
  status: 'online',
  friends: ['user-2', 'user-4', 'user-7', 'user-9']
};

export const users: User[] = [
  currentUser,
  {
    id: 'user-2',
    username: 'NinjaWarrior',
    avatar: 'https://images.pexels.com/photos/1722198/pexels-photo-1722198.jpeg?auto=compress&cs=tinysrgb&w=150',
    level: 56,
    rank: 'Master',
    totalMatches: 345,
    wins: 231,
    losses: 114,
    winRate: 67.0,
    status: 'in-game',
    friends: ['user-1', 'user-5']
  },
  {
    id: 'user-3',
    username: 'PixelQueen',
    avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150',
    level: 38,
    rank: 'Platinum',
    totalMatches: 198,
    wins: 119,
    losses: 79,
    winRate: 60.1,
    status: 'online',
    friends: ['user-6', 'user-8']
  },
  {
    id: 'user-4',
    username: 'LegendSlayer',
    avatar: 'https://images.pexels.com/photos/775358/pexels-photo-775358.jpeg?auto=compress&cs=tinysrgb&w=150',
    level: 67,
    rank: 'Grandmaster',
    totalMatches: 412,
    wins: 298,
    losses: 114,
    winRate: 72.3,
    status: 'offline',
    friends: ['user-1', 'user-7']
  },
  {
    id: 'user-5',
    username: 'ShadowHunter',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    level: 28,
    rank: 'Gold',
    totalMatches: 142,
    wins: 89,
    losses: 53,
    winRate: 62.7,
    status: 'online',
    friends: ['user-2', 'user-9']
  },
  {
    id: 'user-6',
    username: 'CyberWolf',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    level: 51,
    rank: 'Diamond',
    totalMatches: 287,
    wins: 189,
    losses: 98,
    winRate: 65.9,
    status: 'in-game',
    friends: ['user-3', 'user-8']
  },
  {
    id: 'user-7',
    username: 'VictoryQueen',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    level: 43,
    rank: 'Diamond',
    totalMatches: 221,
    wins: 153,
    losses: 68,
    winRate: 69.2,
    status: 'offline',
    friends: ['user-1', 'user-4']
  },
  {
    id: 'user-8',
    username: 'BattleMaster',
    avatar: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=150',
    level: 59,
    rank: 'Master',
    totalMatches: 356,
    wins: 249,
    losses: 107,
    winRate: 69.9,
    status: 'online',
    friends: ['user-3', 'user-6']
  },
  {
    id: 'user-9',
    username: 'EliteGamer',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
    level: 34,
    rank: 'Platinum',
    totalMatches: 178,
    wins: 99,
    losses: 79,
    winRate: 55.6,
    status: 'in-game',
    friends: ['user-1', 'user-5']
  },
  {
    id: 'user-10',
    username: 'SpeedDemon',
    avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150',
    level: 47,
    rank: 'Diamond',
    totalMatches: 264,
    wins: 176,
    losses: 88,
    winRate: 66.7,
    status: 'offline',
    friends: []
  }
];

export const games: Game[] = [
  {
    id: 'snake',
    title: 'Snake Game',
    thumbnail: 'https://images.pexels.com/photos/207983/pexels-photo-207983.jpeg?auto=compress&cs=tinysrgb&w=500',
    players: {
      current: 1,
      max: 1
    },
    mode: 'Single Player',
    map: 'Classic',
    status: 'open',
    skillLevel: 'beginner',
    ping: 0,
    host: 'System',
    botAvailable: true,
    botDifficulty: 'easy'
  },
  {
    id: 'hangman',
    title: 'Hangman',
    thumbnail: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=500',
    players: {
      current: 1,
      max: 1
    },
    mode: 'Single Player',
    map: 'Classic',
    status: 'open',
    skillLevel: 'beginner',
    ping: 0,
    host: 'System',
    botAvailable: true,
    botDifficulty: 'medium'
  },
  {
    id: 'chess',
    title: 'Chess',
    thumbnail: 'https://images.pexels.com/photos/411207/pexels-photo-411207.jpeg?auto=compress&cs=tinysrgb&w=500',
    players: {
      current: 0,
      max: 2
    },
    mode: 'Multiplayer',
    map: 'Classic',
    status: 'open',
    skillLevel: 'intermediate',
    ping: 15,
    host: 'System',
    botAvailable: true,
    botDifficulty: 'hard'
  }
];

export const leaderboard: LeaderboardEntry[] = [
  {
    userId: 'user-4',
    username: 'LegendSlayer',
    avatar: 'https://images.pexels.com/photos/775358/pexels-photo-775358.jpeg?auto=compress&cs=tinysrgb&w=150',
    rank: 1,
    level: 67,
    wins: 298,
    losses: 114,
    winRate: 72.3,
    lastPlayed: '2023-09-15'
  },
  {
    userId: 'user-8',
    username: 'BattleMaster',
    avatar: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=150',
    rank: 2,
    level: 59,
    wins: 249,
    losses: 107,
    winRate: 69.9,
    lastPlayed: '2023-09-14'
  },
  {
    userId: 'user-7',
    username: 'VictoryQueen',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    rank: 3,
    level: 43,
    wins: 153,
    losses: 68,
    winRate: 69.2,
    lastPlayed: '2023-09-16'
  },
  {
    userId: 'user-1',
    username: 'ProGamer99',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
    rank: 4,
    level: 42,
    wins: 167,
    losses: 81,
    winRate: 67.3,
    lastPlayed: '2023-09-16'
  },
  {
    userId: 'user-2',
    username: 'NinjaWarrior',
    avatar: 'https://images.pexels.com/photos/1722198/pexels-photo-1722198.jpeg?auto=compress&cs=tinysrgb&w=150',
    rank: 5,
    level: 56,
    wins: 231,
    losses: 114,
    winRate: 67.0,
    lastPlayed: '2023-09-15'
  },
  {
    userId: 'user-10',
    username: 'SpeedDemon',
    avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150',
    rank: 6,
    level: 47,
    wins: 176,
    losses: 88,
    winRate: 66.7,
    lastPlayed: '2023-09-13'
  },
  {
    userId: 'user-6',
    username: 'CyberWolf',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    rank: 7,
    level: 51,
    wins: 189,
    losses: 98,
    winRate: 65.9,
    lastPlayed: '2023-09-14'
  },
  {
    userId: 'user-5',
    username: 'ShadowHunter',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    rank: 8,
    level: 28,
    wins: 89,
    losses: 53,
    winRate: 62.7,
    lastPlayed: '2023-09-15'
  },
  {
    userId: 'user-3',
    username: 'PixelQueen',
    avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150',
    rank: 9,
    level: 38,
    wins: 119,
    losses: 79,
    winRate: 60.1,
    lastPlayed: '2023-09-16'
  },
  {
    userId: 'user-9',
    username: 'EliteGamer',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
    rank: 10,
    level: 34,
    wins: 99,
    losses: 79,
    winRate: 55.6,
    lastPlayed: '2023-09-15'
  }
];