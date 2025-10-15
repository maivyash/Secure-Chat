import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import vpnClient from '../services/vpnClient';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io('http://localhost:5000', {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
        newSocket.emit('user:join', user.id);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      newSocket.on('user:status', ({ userId, status }) => {
        setOnlineUsers(prev => {
          const updated = new Set(prev);
          if (status === 'online') {
            updated.add(userId);
          } else {
            updated.delete(userId);
          }
          return updated;
        });
      });

      // Listen for VPN tunnel events
      newSocket.on('vpn:tunnel:created', (tunnelData) => {
        console.log('VPN Tunnel created:', tunnelData);
        vpnClient.initializeTunnel(tunnelData);
      });

      setSocket(newSocket);

      return () => {
        vpnClient.disconnect();
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  const sendMessage = (messageData) => {
    if (socket && connected) {
      socket.emit('message:send', messageData);
    }
  };

  const joinChatRoom = (chatRoomId) => {
    if (socket && connected) {
      socket.emit('chatroom:join', chatRoomId);
    }
  };

  const leaveChatRoom = (chatRoomId) => {
    if (socket && connected) {
      socket.emit('chatroom:leave', chatRoomId);
    }
  };

  const startTyping = (chatRoomId, username) => {
    if (socket && connected) {
      socket.emit('typing:start', { chatRoomId, userId: user.id, username });
    }
  };

  const stopTyping = (chatRoomId, username) => {
    if (socket && connected) {
      socket.emit('typing:stop', { chatRoomId, userId: user.id, username });
    }
  };

  const markMessageAsRead = (messageId) => {
    if (socket && connected) {
      socket.emit('message:read', { messageId, userId: user.id });
    }
  };

  const value = {
    socket,
    connected,
    onlineUsers,
    sendMessage,
    joinChatRoom,
    leaveChatRoom,
    startTyping,
    stopTyping,
    markMessageAsRead
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
