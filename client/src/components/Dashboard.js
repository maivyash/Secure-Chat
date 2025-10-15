import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../utils/api';
import { 
  Users, MessageSquare, Activity, Globe, 
  Shield, TrendingUp, BarChart3 
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import './Dashboard.css';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.getDashboard();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Fetch analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="dashboard-error">
        <p>Failed to load analytics</p>
      </div>
    );
  }

  const usersByRoleData = analytics.usersByRole.map(item => ({
    name: item._id.replace('_', ' ').toUpperCase(),
    value: item.count
  }));

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">HQ Command Dashboard</h1>
          <p className="dashboard-subtitle">Real-time communication analytics and monitoring</p>
        </div>
        <div className="dashboard-badge">
          <Shield size={20} />
          <span>SECURE ACCESS</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <Users size={24} style={{ color: '#10b981' }} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Active Users</div>
            <div className="stat-value">{analytics.activeUsers}</div>
            <div className="stat-change positive">
              <TrendingUp size={14} />
              <span>Online now</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
            <MessageSquare size={24} style={{ color: '#3b82f6' }} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Messages</div>
            <div className="stat-value">{analytics.totalMessages}</div>
            <div className="stat-change positive">
              <TrendingUp size={14} />
              <span>All time</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <Activity size={24} style={{ color: '#f59e0b' }} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Chat Rooms</div>
            <div className="stat-value">{analytics.totalChatRooms}</div>
            <div className="stat-change">
              <span>Active channels</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
            <Shield size={24} style={{ color: '#8b5cf6' }} />
          </div>
          <div className="stat-content">
            <div className="stat-label">VPN Tunnels</div>
            <div className="stat-value">{analytics.vpnTunnelUsage?.length || 0}</div>
            <div className="stat-change positive">
              <TrendingUp size={14} />
              <span>Secured</span>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Message Activity (Last 7 Days)</h3>
            <BarChart3 size={20} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.messagesOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="_id" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  background: '#1a2332', 
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Users by Role</h3>
            <Users size={20} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={usersByRoleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {usersByRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: '#1a2332', 
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>Top Active Users (Message Frequency)</h3>
            <Activity size={20} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.messagesByUser}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="username" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  background: '#1a2332', 
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
              <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Messages by Location</h3>
            <Globe size={20} />
          </div>
          <div className="location-list">
            {analytics.messagesByLocation.map((location, index) => (
              <div key={index} className="location-item">
                <div className="location-info">
                  <Globe size={16} />
                  <span className="location-name">{location._id}</span>
                </div>
                <div className="location-count">
                  <span className="count-value">{location.count}</span>
                  <div 
                    className="count-bar"
                    style={{ 
                      width: `${(location.count / analytics.messagesByLocation[0].count) * 100}%`,
                      background: COLORS[index % COLORS.length]
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>VPN Tunnel Usage</h3>
            <Shield size={20} />
          </div>
          <div className="vpn-list">
            {analytics.vpnTunnelUsage.map((vpn, index) => (
              <div key={index} className="vpn-item">
                <div className="vpn-info">
                  <Shield size={16} style={{ color: COLORS[index % COLORS.length] }} />
                  <span className="vpn-name">{vpn._id}</span>
                </div>
                <span className="vpn-count badge badge-green">{vpn.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
