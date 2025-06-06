import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../../services/socket';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on('chatMessage', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('chatMessage');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    socket.emit('sendMessage', {
      text: newMessage
    });

    setNewMessage('');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-[400px] flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            <span className="text-purple-400 font-medium">{message.username}: </span>
            <span className="text-white">{message.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button onClick={handleSend}>
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default Chat;