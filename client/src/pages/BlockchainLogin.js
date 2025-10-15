import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import web3Service from '../utils/web3';
import axios from 'axios';
import { Shield, Wallet, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import './BlockchainLogin.css';

const BlockchainLogin = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('connect'); // connect, sign, authenticate
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    checkExistingConnection();
  }, []);

  const checkExistingConnection = async () => {
    const account = await web3Service.getCurrentAccount();
    if (account) {
      setWalletAddress(account);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setError('');

    try {
      const { address } = await web3Service.connectWallet();
      setWalletAddress(address);
      setStep('sign');
    } catch (error) {
      console.error('Wallet connection error:', error);
      if (error.message.includes('MetaMask')) {
        setError('MetaMask is not installed. Please install MetaMask extension to continue.');
      } else {
        setError(error.message || 'Failed to connect wallet');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const authenticateWithBlockchain = async () => {
    setIsAuthenticating(true);
    setError('');

    try {
      // Step 1: Request nonce from server
      const nonceResponse = await axios.post('/api/blockchain/request-nonce', {
        walletAddress
      });

      const { nonce } = nonceResponse.data;

      // Step 2: Sign nonce with wallet
      setStep('sign');
      const signature = await web3Service.signMessage(nonce);

      // Step 3: Verify signature with server
      setStep('authenticate');
      const authResponse = await axios.post('/api/blockchain/verify-signature', {
        walletAddress,
        signature
      });

      if (authResponse.data.needsRegistration) {
        setNeedsRegistration(true);
        setError('Account not found. Please register first.');
        return;
      }

      // Success - save token and user
      const { token, user } = authResponse.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setToken(token);
      setUser(user);

      // Navigate to chat
      navigate('/chat');
    } catch (error) {
      console.error('Authentication error:', error);
      if (error.response?.data?.needsRegistration) {
        setNeedsRegistration(true);
        setError('Account not found. Please register first.');
      } else {
        setError(error.response?.data?.error || 'Authentication failed');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleRegister = () => {
    navigate('/register-blockchain', { state: { walletAddress } });
  };

  return (
    <div className="blockchain-login">
      <div className="blockchain-login-container">
        <div className="blockchain-login-header">
          <Shield size={48} className="header-icon" />
          <h1>Blockchain Authentication</h1>
          <p>Connect your wallet to access SecureComm</p>
        </div>

        <div className="blockchain-steps">
          <div className={`step ${step === 'connect' ? 'active' : walletAddress ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Connect Wallet</div>
          </div>
          <div className="step-divider"></div>
          <div className={`step ${step === 'sign' ? 'active' : step === 'authenticate' ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Sign Message</div>
          </div>
          <div className="step-divider"></div>
          <div className={`step ${step === 'authenticate' ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Authenticate</div>
          </div>
        </div>

        {error && (
          <div className="blockchain-alert error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {walletAddress && !needsRegistration && (
          <div className="blockchain-alert success">
            <CheckCircle size={20} />
            <span>Wallet Connected: {web3Service.formatAddress(walletAddress)}</span>
          </div>
        )}

        <div className="blockchain-actions">
          {!walletAddress ? (
            <button
              className="btn btn-primary btn-large"
              onClick={connectWallet}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader size={20} className="spinner" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet size={20} />
                  Connect MetaMask
                </>
              )}
            </button>
          ) : needsRegistration ? (
            <div className="registration-prompt">
              <p>No account found for this wallet address.</p>
              <button
                className="btn btn-primary btn-large"
                onClick={handleRegister}
              >
                Register New Account
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-large"
              onClick={authenticateWithBlockchain}
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <>
                  <Loader size={20} className="spinner" />
                  {step === 'sign' ? 'Waiting for signature...' : 'Authenticating...'}
                </>
              ) : (
                <>
                  <Shield size={20} />
                  Authenticate with Blockchain
                </>
              )}
            </button>
          )}
        </div>

        <div className="blockchain-info">
          <h3>Why Blockchain Authentication?</h3>
          <ul>
            <li>
              <Shield size={16} />
              <span>Decentralized and secure authentication</span>
            </li>
            <li>
              <CheckCircle size={16} />
              <span>No password required - use your wallet</span>
            </li>
            <li>
              <Shield size={16} />
              <span>Cryptographic proof of identity</span>
            </li>
            <li>
              <CheckCircle size={16} />
              <span>Full control over your credentials</span>
            </li>
          </ul>
        </div>

        <div className="blockchain-footer">
          <p>Don't have MetaMask?</p>
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="metamask-link"
          >
            Download MetaMask
          </a>
          <div className="traditional-login">
            <span>or</span>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/login')}
            >
              Use Traditional Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainLogin;
