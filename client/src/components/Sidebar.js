import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatRoomsAPI } from '../utils/api';
import { 
  MessageSquare, BarChart3, Users, LogOut, Shield, 
  Plus, Search, Hash, User as UserIcon, Bell, Settings 
} from 'lucide-react';
import { getInitials, getAvatarColor, formatMessageTime, getRoleBadgeColor, getRoleDisplayName } from '../utils/helpers';
import CreateChatModal from './CreateChatModal';
import NotificationPanel from './NotificationPanel';
import UserProfile from './UserProfile';
import './Sidebar.css';

const Sidebar = ({ activeView, setActiveView, selectedChatRoom, setSelectedChatRoom }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, logout, isHQStaff } = useAuth();

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      const response = await chatRoomsAPI.getAll();
      setChatRooms(response.data);
    } catch (error) {
      console.error('Fetch chat rooms error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChatRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Shield size={24} className="logo-icon" />
          <span className="logo-text">SECURECOMM</span>
        </div>
        
        <div className="header-actions">
          <button 
            className="header-action-btn"
            onClick={() => setShowNotifications(true)}
            title="Notifications"
          >
            <Bell size={20} />
          </button>
          <button 
            className="header-action-btn"
            onClick={() => setShowProfile(true)}
            title="Profile Settings"
          >
            <Settings size={20} />
          </button>
        </div>
        
        <div className="user-info" onClick={() => setShowProfile(true)} style={{ cursor: 'pointer' }}>
          <div 
            className="user-avatar"
            style={{ background: getAvatarColor(user.fullName) }}
          >
            {getInitials(user.fullName)}
          </div>
          <div className="user-details">
            <div className="user-name">{user.fullName}</div>
            <div className="user-role">
              <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                {getRoleDisplayName(user.role)}
              </span>
              {user.rank && <span className="user-rank">{user.rank}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-nav">
        <button
          className={`nav-item ${activeView === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveView('chat')}
        >
          <MessageSquare size={20} />
          <span>Messages</span>
        </button>
        
        {isHQStaff && (
          <>
            <button
              className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveView('dashboard')}
            >
              <BarChart3 size={20} />
              <span>Dashboard</span>
            </button>
            
            <button
              className={`nav-item ${activeView === 'users' ? 'active' : ''}`}
              onClick={() => setActiveView('users')}
            >
              <Users size={20} />
              <span>User Management</span>
            </button>
          </>
        )}
        
        <button className="nav-item logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {activeView === 'chat' && (
        <div className="chat-list-container">
          <div className="chat-list-header">
            <h3>Chat Rooms</h3>
            <button 
              className="btn-icon"
              onClick={() => setShowCreateModal(true)}
              title="Create new chat"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="chat-list">
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
              </div>
            ) : filteredChatRooms.length === 0 ? (
              <div className="empty-state">
                <MessageSquare size={48} />
                <p>No chat rooms found</p>
              </div>
            ) : (
              filteredChatRooms.map(room => (
                <div
                  key={room._id}
                  className={`chat-item ${selectedChatRoom?._id === room._id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedChatRoom(room);
                    setActiveView('chat');
                  }}
                >
                  <div className="chat-avatar">
                    {room.type === 'group' ? (
                      <Hash size={20} />
                    ) : (
                      <UserIcon size={20} />
                    )}
                  </div>
                  
                  <div className="chat-info">
                    <div className="chat-name">{room.name}</div>
                    {room.lastMessage && (
                      <div className="chat-preview">
                        {room.lastMessage.content?.substring(0, 30)}...
                      </div>
                    )}
                  </div>
                  
                  {room.lastMessage && (
                    <div className="chat-time">
                      {formatMessageTime(room.updatedAt)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreateChatModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(newRoom) => {
            setChatRooms([newRoom, ...chatRooms]);
            setSelectedChatRoom(newRoom);
            setShowCreateModal(false);
          }}
        />
      )}

      <NotificationPanel 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <UserProfile 
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
  );
};

export default Sidebar;
