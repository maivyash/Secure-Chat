import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, User, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/chat');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const quickLogin = (user, pass) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="grid-overlay"></div>
      </div>
      
      <div className="login-card fade-in">
        <div className="login-header">
          <div className="logo-container">
            <Shield size={48} className="logo-icon" />
          </div>
          <h1 className="login-title">SECURECOMM</h1>
          <p className="login-subtitle">Military Secure Communication System</p>
          <div className="security-badge">
            <Lock size={14} />
            <span>Blockchain Authenticated</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <User size={16} />
              Username
            </label>
            <input
              id="username"
              type="text"
              className="input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <Lock size={16} />
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary login-button"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <Lock size={18} />
                Secure Login
              </>
            )}
          </button>
        </form>

        <div className="demo-credentials">
          <p className="demo-title">Demo Credentials:</p>
          <div className="demo-buttons">
            <button
              className="demo-btn"
              onClick={() => quickLogin('hq.admin', 'admin123')}
            >
              HQ Staff
            </button>
            <button
              className="demo-btn"
              onClick={() => quickLogin('soldier.john', 'soldier123')}
            >
              Military
            </button>
            <button
              className="demo-btn"
              onClick={() => quickLogin('family.jane', 'family123')}
            >
              Family
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p>Encrypted • Secure • Blockchain Verified</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
