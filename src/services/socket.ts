import { io } from 'socket.io-client';

// Use a fallback URL for development/demo purposes
const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? 'wss://gamepulse-server.herokuapp.com' 
  : 'http://localhost:3001';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  path: '/socket.io',
  timeout: 20000,
  forceNew: true
});

export const connectSocket = (userId: string) => {
  socket.auth = { userId };
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

// Add error handling for socket connection
socket.on('connect_error', (error) => {
  console.warn('Socket connection failed:', error.message);
  // Continue without real-time features
});

socket.on('disconnect', (reason) => {
  console.warn('Socket disconnected:', reason);
});