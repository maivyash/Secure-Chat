import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { chatRoomsAPI } from '../utils/api';
import { 
  Send, Paperclip, MapPin, Shield, Lock, 
  Users, Info, MoreVertical 
} from 'lucide-react';
import { formatMessageTime, getInitials, getAvatarColor } from '../utils/helpers';
import MessageItem from './MessageItem';
import VPNStatus from './VPNStatus';
import './ChatWindow.css';

const ChatWindow = ({ selectedChatRoom, setSelectedChatRoom }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { socket, sendMessage, joinChatRoom, leaveChatRoom } = useSocket();

  useEffect(() => {
    if (selectedChatRoom) {
      fetchMessages();
      joinChatRoom(selectedChatRoom._id);

      return () => {
        leaveChatRoom(selectedChatRoom._id);
      };
    }
  }, [selectedChatRoom]);

  useEffect(() => {
    if (socket) {
      socket.on('message:receive', (message) => {
        if (message.chatRoom === selectedChatRoom?._id) {
          setMessages(prev => [...prev, message]);
          scrollToBottom();
        }
      });

      return () => {
        socket.off('message:receive');
      };
    }
  }, [socket, selectedChatRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!selectedChatRoom) return;
    
    setLoading(true);
    try {
      const response = await chatRoomsAPI.getMessages(selectedChatRoom._id);
      setMessages(response.data);
    } catch (error) {
      console.error('Fetch messages error:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedChatRoom) return;

    const messageData = {
      chatRoomId: selectedChatRoom._id,
      content: newMessage,
      senderId: user.id,
      messageType: 'text'
    };

    sendMessage(messageData);
    setNewMessage('');
  };

  if (!selectedChatRoom) {
    return (
      <div className="chat-window-empty">
        <Shield size={64} className="empty-icon" />
        <h2>Secure Communication Ready</h2>
        <p>Select a chat room to start messaging</p>
        <div className="security-features">
          <div className="feature-item">
            <Lock size={20} />
            <span>End-to-End Encrypted</span>
          </div>
          <div className="feature-item">
            <Shield size={20} />
            <span>Blockchain Authenticated</span>
          </div>
          <div className="feature-item">
            <MapPin size={20} />
            <span>Geo-Located Messages</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-header-avatar">
            {selectedChatRoom.type === 'group' ? (
              <Users size={24} />
            ) : (
              getInitials(selectedChatRoom.name)
            )}
          </div>
          <div className="chat-header-details">
            <h2 className="chat-header-name">{selectedChatRoom.name}</h2>
            <div className="chat-header-meta">
              <Users size={14} />
              <span>{selectedChatRoom.participants?.length || 0} participants</span>
              {selectedChatRoom.description && (
                <>
                  <span className="separator">•</span>
                  <span>{selectedChatRoom.description}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="chat-header-actions">
          <VPNStatus />
          <div className="security-indicators">
            <div className="indicator" title="End-to-End Encryption">
              <Lock size={16} />
            </div>
            <div className="indicator" title="VPN Secured">
              <Shield size={16} />
            </div>
          </div>
          
          <button 
            className="btn-icon"
            onClick={() => setShowInfo(!showInfo)}
            title="Chat info"
          >
            <Info size={20} />
          </button>
        </div>
      </div>

      <div className="messages-container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message, index) => (
              <MessageItem
                key={message._id || index}
                message={message}
                isOwn={message.sender._id === user.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form className="message-input-container" onSubmit={handleSendMessage}>
        <button
          type="button"
          className="btn-icon"
          title="Attach file"
        >
          <Paperclip size={20} />
        </button>
        
        <input
          type="text"
          className="message-input"
          placeholder="Type a secure message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        
        <button
          type="submit"
          className="btn-send"
          disabled={!newMessage.trim()}
        >
          <Send size={20} />
        </button>
      </form>

      {showInfo && (
        <div className="chat-info-panel">
          <div className="info-header">
            <h3>Chat Information</h3>
            <button onClick={() => setShowInfo(false)}>×</button>
          </div>
          
          <div className="info-section">
            <h4>Participants ({selectedChatRoom.participants?.length || 0})</h4>
            <div className="participants-list">
              {selectedChatRoom.participants?.map(participant => (
                <div key={participant._id} className="participant-item">
                  <div 
                    className="participant-avatar"
                    style={{ background: getAvatarColor(participant.fullName) }}
                  >
                    {getInitials(participant.fullName)}
                  </div>
                  <div className="participant-info">
                    <div className="participant-name">{participant.fullName}</div>
                    <div className="participant-role">{participant.rank || participant.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="info-section">
            <h4>Security</h4>
            <div className="security-info">
              <div className="security-item">
                <Lock size={16} />
                <span>AES-256 Encryption</span>
              </div>
              <div className="security-item">
                <Shield size={16} />
                <span>VPN Tunneling Active</span>
              </div>
              <div className="security-item">
                <MapPin size={16} />
                <span>Geo-Location Tracking</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
