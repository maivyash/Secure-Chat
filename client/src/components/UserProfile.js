import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, User, Shield, MapPin, Clock, Edit, Save, 
  Key, Bell, Lock, Globe 
} from 'lucide-react';
import { getInitials, getAvatarColor, getRoleBadgeColor, getRoleDisplayName, formatRelativeTime } from '../utils/helpers';
import './UserProfile.css';

const UserProfile = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleSave = () => {
    // TODO: Implement profile update API call
    setIsEditing(false);
  };

  if (!isOpen || !user) return null;

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <h2>User Profile</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            Profile
          </button>
          <button
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={18} />
            Security
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Bell size={18} />
            Settings
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="profile-tab">
              <div className="profile-avatar-section">
                <div 
                  className="profile-avatar-large"
                  style={{ background: getAvatarColor(user.fullName) }}
                >
                  {getInitials(user.fullName)}
                </div>
                <button className="edit-avatar-btn">
                  <Edit size={16} />
                  Change Avatar
                </button>
              </div>

              <div className="profile-info-section">
                <div className="info-group">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="input"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  ) : (
                    <div className="info-value">{user.fullName}</div>
                  )}
                </div>

                <div className="info-group">
                  <label>Username</label>
                  <div className="info-value">@{user.username}</div>
                </div>

                <div className="info-group">
                  <label>Role</label>
                  <div className="info-value">
                    <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </div>
                </div>

                {user.rank && (
                  <div className="info-group">
                    <label>Rank</label>
                    <div className="info-value">{user.rank}</div>
                  </div>
                )}

                {user.unit && (
                  <div className="info-group">
                    <label>Unit</label>
                    <div className="info-value">{user.unit}</div>
                  </div>
                )}

                <div className="info-group">
                  <label>Status</label>
                  <div className="info-value">
                    <span className={`status-indicator ${user.status === 'online' ? 'status-online' : 'status-offline'}`}></span>
                    {user.status}
                  </div>
                </div>

                <div className="info-group">
                  <label>Last Seen</label>
                  <div className="info-value">
                    <Clock size={16} />
                    {formatRelativeTime(user.lastSeen)}
                  </div>
                </div>

                <div className="profile-actions">
                  {isEditing ? (
                    <>
                      <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                      <button className="btn btn-primary" onClick={handleSave}>
                        <Save size={18} />
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                      <Edit size={18} />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="security-tab">
              <div className="security-section">
                <h3>
                  <Shield size={20} />
                  Blockchain Authentication
                </h3>
                <div className="security-item">
                  <div className="security-label">Blockchain Address</div>
                  <div className="security-value blockchain-address">
                    {user.blockchainAddress}
                  </div>
                </div>
                <div className="security-status">
                  <div className="status-indicator status-online"></div>
                  <span>Verified & Secured</span>
                </div>
              </div>

              <div className="security-section">
                <h3>
                  <Lock size={20} />
                  Encryption
                </h3>
                <div className="security-item">
                  <div className="security-label">Message Encryption</div>
                  <div className="security-value">AES-256 Enabled</div>
                </div>
                <div className="security-item">
                  <div className="security-label">VPN Tunneling</div>
                  <div className="security-value">Active</div>
                </div>
              </div>

              <div className="security-section">
                <h3>
                  <Key size={20} />
                  Password
                </h3>
                <button className="btn btn-secondary">
                  Change Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-tab">
              <div className="settings-section">
                <h3>
                  <Bell size={20} />
                  Notifications
                </h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-label">Message Notifications</div>
                    <div className="setting-description">Receive notifications for new messages</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-label">Sound Alerts</div>
                    <div className="setting-description">Play sound for incoming messages</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="settings-section">
                <h3>
                  <Globe size={20} />
                  Privacy
                </h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-label">Show Online Status</div>
                    <div className="setting-description">Let others see when you're online</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-label">Read Receipts</div>
                    <div className="setting-description">Show when you've read messages</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
