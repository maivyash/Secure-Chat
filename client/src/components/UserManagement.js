import React, { useState, useEffect } from 'react';
import { usersAPI } from '../utils/api';
import { 
  Users, Search, Edit, Trash2, UserPlus, 
  Shield, Activity, Clock 
} from 'lucide-react';
import { 
  getInitials, getAvatarColor, getRoleBadgeColor, 
  getRoleDisplayName, getStatusColor, formatRelativeTime 
} from '../utils/helpers';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await usersAPI.delete(userId);
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      console.error('Delete user error:', error);
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userStats = {
    total: users.length,
    hqStaff: users.filter(u => u.role === 'hq_staff').length,
    military: users.filter(u => u.role === 'military_personnel').length,
    family: users.filter(u => u.role === 'family_member').length,
    online: users.filter(u => u.status === 'online').length
  };

  return (
    <div className="user-management">
      <div className="management-header">
        <div>
          <h1 className="management-title">User Management</h1>
          <p className="management-subtitle">Manage and monitor all system users</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus size={18} />
          Add New User
        </button>
      </div>

      <div className="user-stats">
        <div className="user-stat-card">
          <Users size={20} />
          <div>
            <div className="stat-number">{userStats.total}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
        <div className="user-stat-card">
          <Shield size={20} style={{ color: '#ef4444' }} />
          <div>
            <div className="stat-number">{userStats.hqStaff}</div>
            <div className="stat-label">HQ Staff</div>
          </div>
        </div>
        <div className="user-stat-card">
          <Shield size={20} style={{ color: '#10b981' }} />
          <div>
            <div className="stat-number">{userStats.military}</div>
            <div className="stat-label">Military</div>
          </div>
        </div>
        <div className="user-stat-card">
          <Users size={20} style={{ color: '#3b82f6' }} />
          <div>
            <div className="stat-number">{userStats.family}</div>
            <div className="stat-label">Family</div>
          </div>
        </div>
        <div className="user-stat-card">
          <Activity size={20} style={{ color: '#10b981' }} />
          <div>
            <div className="stat-number">{userStats.online}</div>
            <div className="stat-label">Online Now</div>
          </div>
        </div>
      </div>

      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search users by name or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input-full"
        />
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Rank/Unit</th>
                <th>Status</th>
                <th>Last Seen</th>
                <th>Blockchain Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="user-cell">
                      <div 
                        className="user-avatar-small"
                        style={{ background: getAvatarColor(user.fullName) }}
                      >
                        {getInitials(user.fullName)}
                      </div>
                      <div>
                        <div className="user-cell-name">{user.fullName}</div>
                        <div className="user-cell-username">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </td>
                  <td>
                    <div className="rank-cell">
                      {user.rank && <div className="rank-text">{user.rank}</div>}
                      {user.unit && <div className="unit-text">{user.unit}</div>}
                    </div>
                  </td>
                  <td>
                    <div className="status-cell">
                      <span className={`status-indicator ${getStatusColor(user.status)}`}></span>
                      <span className="status-text">{user.status}</span>
                    </div>
                  </td>
                  <td>
                    <div className="time-cell">
                      <Clock size={14} />
                      <span>{formatRelativeTime(user.lastSeen)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="blockchain-cell">
                      <Shield size={14} />
                      <span className="blockchain-address">
                        {user.blockchainAddress.substring(0, 10)}...
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn edit"
                        title="Edit user"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDeleteUser(user._id)}
                        title="Delete user"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
