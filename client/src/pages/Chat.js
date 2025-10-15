import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import Dashboard from '../components/Dashboard';
import UserManagement from '../components/UserManagement';
import './Chat.css';

const Chat = () => {
  const [activeView, setActiveView] = useState('chat');
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  const { user, isHQStaff } = useAuth();
  const { connected } = useSocket();

  return (
    <div className="chat-container">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        selectedChatRoom={selectedChatRoom}
        setSelectedChatRoom={setSelectedChatRoom}
      />
      
      <div className="main-content">
        {activeView === 'chat' && (
          <ChatWindow
            selectedChatRoom={selectedChatRoom}
            setSelectedChatRoom={setSelectedChatRoom}
          />
        )}
        
        {activeView === 'dashboard' && isHQStaff && (
          <Dashboard />
        )}
        
        {activeView === 'users' && isHQStaff && (
          <UserManagement />
        )}
      </div>

      {!connected && (
        <div className="connection-status">
          <div className="status-indicator status-offline pulse"></div>
          Reconnecting...
        </div>
      )}
    </div>
  );
};

export default Chat;
