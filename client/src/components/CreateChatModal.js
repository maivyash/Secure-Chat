import React, { useState, useEffect } from 'react';
import { usersAPI, chatRoomsAPI } from '../utils/api';
import { X, Users, Hash, Search } from 'lucide-react';
import { getInitials, getAvatarColor } from '../utils/helpers';
import './CreateChatModal.css';

const CreateChatModal = ({ onClose, onCreated }) => {
  const [chatName, setChatName] = useState('');
  const [chatType, setChatType] = useState('group');
  const [description, setDescription] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Fetch users error:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!chatName.trim() || selectedUsers.length === 0) {
      alert('Please enter a chat name and select at least one participant');
      return;
    }

    setLoading(true);
    try {
      const response = await chatRoomsAPI.create({
        name: chatName,
        type: chatType,
        participants: selectedUsers,
        description
      });
      
      onCreated(response.data);
    } catch (error) {
      console.error('Create chat error:', error);
      alert('Failed to create chat room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Chat</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Chat Type</label>
            <div className="chat-type-selector">
              <button
                type="button"
                className={`type-btn ${chatType === 'group' ? 'active' : ''}`}
                onClick={() => setChatType('group')}
              >
                <Hash size={20} />
                Group Chat
              </button>
              <button
                type="button"
                className={`type-btn ${chatType === 'direct' ? 'active' : ''}`}
                onClick={() => setChatType('direct')}
              >
                <Users size={20} />
                Direct Message
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="chatName">Chat Name</label>
            <input
              id="chatName"
              type="text"
              className="input"
              placeholder="Enter chat name"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <input
              id="description"
              type="text"
              className="input"
              placeholder="Enter chat description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Select Participants</label>
            <div className="search-container-modal">
              <Search size={16} />
              <input
                type="text"
                className="search-input-modal"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="selected-users">
              {selectedUsers.length > 0 && (
                <div className="selected-count">
                  {selectedUsers.length} participant(s) selected
                </div>
              )}
            </div>

            <div className="users-list-modal">
              {filteredUsers.map(user => (
                <div
                  key={user._id}
                  className={`user-item-modal ${selectedUsers.includes(user._id) ? 'selected' : ''}`}
                  onClick={() => toggleUser(user._id)}
                >
                  <div 
                    className="user-avatar-modal"
                    style={{ background: getAvatarColor(user.fullName) }}
                  >
                    {getInitials(user.fullName)}
                  </div>
                  <div className="user-info-modal">
                    <div className="user-name-modal">{user.fullName}</div>
                    <div className="user-role-modal">
                      {user.rank || user.role}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => {}}
                    className="user-checkbox"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !chatName.trim() || selectedUsers.length === 0}
            >
              {loading ? 'Creating...' : 'Create Chat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChatModal;
