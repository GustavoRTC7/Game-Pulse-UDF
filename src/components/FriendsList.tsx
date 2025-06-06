import React from 'react';
import { User } from '../types';
import Card, { CardHeader, CardContent } from './ui/Card';
import Avatar from './ui/Avatar';
import Button from './ui/Button';
import { MessageSquare, UserPlus } from 'lucide-react';

interface FriendsListProps {
  currentUser: User;
  users: User[];
}

const FriendsList: React.FC<FriendsListProps> = ({ currentUser, users }) => {
  // Filter online friends
  const friends = users.filter(user => 
    currentUser.friends.includes(user.id) && user.status !== 'offline'
  );
  
  // Get suggested friends (not friends and not current user)
  const suggested = users.filter(user => 
    !currentUser.friends.includes(user.id) && user.id !== currentUser.id
  ).slice(0, 3);
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-white">Online Friends</h3>
        </CardHeader>
        <CardContent>
          {friends.length > 0 ? (
            <ul className="space-y-4">
              {friends.map(friend => (
                <li key={friend.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar 
                      src={friend.avatar} 
                      alt={friend.username}
                      status={friend.status}
                      size="md"
                    />
                    <div className="ml-3">
                      <p className="text-white font-medium">{friend.username}</p>
                      <p className="text-xs text-gray-400">
                        {friend.status === 'in-game' ? 'In Game' : 'Online'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <MessageSquare size={16} />
                    </Button>
                    {friend.status === 'in-game' && (
                      <Button variant="primary" size="sm">
                        Join
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No friends online at the moment.</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-white">Suggested Friends</h3>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {suggested.map(user => (
              <li key={user.id} className="flex items-center justify-between">
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
                  Add
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendsList;