import React, { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { useApp } from '../context/AppContext';
import Avatar from './ui/Avatar';
import Badge from './ui/Badge';

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  onSort: (field: string) => void;
  sortBy: string;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ data, onSort, sortBy }) => {
  const { currentUser } = useApp();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortDirection('asc');
    }
    onSort(field);
  };

  const rankColors = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-400';
      case 2:
        return 'text-gray-400';
      case 3:
        return 'text-amber-600';
      default:
        return 'text-gray-300';
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };

  // Update leaderboard data to show current user's updated info
  const updatedData = data.map(entry => {
    if (entry.userId === currentUser.id) {
      return {
        ...entry,
        username: currentUser.username,
        avatar: currentUser.avatar
      };
    }
    return entry;
  });

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Player
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer group flex items-center"
                onClick={() => handleSort('level')}
              >
                Level <SortIcon field="level" />
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer group flex items-center"
                onClick={() => handleSort('wins')}
              >
                Wins <SortIcon field="wins" />
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer group flex items-center"
                onClick={() => handleSort('losses')}
              >
                Losses <SortIcon field="losses" />
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer group flex items-center"
                onClick={() => handleSort('winRate')}
              >
                Win Rate <SortIcon field="winRate" />
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Last Played
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {updatedData.map((entry) => (
              <tr key={entry.userId} className="hover:bg-gray-750 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-lg font-bold ${rankColors(entry.rank)}`}>
                    {entry.rank <= 3 ? (
                      <span className="flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full">
                        {entry.rank}
                      </span>
                    ) : (
                      entry.rank
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar
                      src={entry.avatar}
                      alt={entry.username}
                      size="md"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{entry.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-gray-200 font-medium">{entry.level}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-green-400">
                  {entry.wins}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-red-400">
                  {entry.losses}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    variant={entry.winRate > 65 ? "success" : entry.winRate > 50 ? "warning" : "error"}
                    className={entry.winRate > 65 ? "bg-green-800" : entry.winRate > 50 ? "bg-yellow-800" : "bg-red-800"}
                  >
                    {entry.winRate.toFixed(1)}%
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {entry.lastPlayed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;