const express = require('express');
const router = express.Router();
const blockchainService = require('../services/blockchainService');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const crypto = require('crypto');

// Store nonces temporarily (in production, use Redis)
const nonces = new Map();

/**
 * Request nonce for wallet authentication
 */
router.post('/request-nonce', async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    // Generate nonce
    const nonce = blockchainService.generateNonce();
    
    // Store nonce with expiration (5 minutes)
    nonces.set(walletAddress.toLowerCase(), {
      nonce,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    res.json({ nonce, walletAddress });
  } catch (error) {
    console.error('Request nonce error:', error);
    res.status(500).json({ error: 'Failed to generate nonce' });
  }
});

/**
 * Verify wallet signature and authenticate
 */
router.post('/verify-signature', async (req, res) => {
  try {
    const { walletAddress, signature } = req.body;

    if (!walletAddress || !signature) {
      return res.status(400).json({ error: 'Wallet address and signature required' });
    }

    const walletLower = walletAddress.toLowerCase();

    // Get stored nonce
    const nonceData = nonces.get(walletLower);
    if (!nonceData) {
      return res.status(400).json({ error: 'Nonce not found. Please request a new nonce.' });
    }

    // Check if nonce expired
    if (Date.now() > nonceData.expiresAt) {
      nonces.delete(walletLower);
      return res.status(400).json({ error: 'Nonce expired. Please request a new nonce.' });
    }

    // Verify signature
    const isValid = blockchainService.verifySignature(
      nonceData.nonce,
      signature,
      walletAddress
    );

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Clear used nonce
    nonces.delete(walletLower);

    // Check if user exists in database
    let user = await User.findOne({ blockchainAddress: walletLower });

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        needsRegistration: true,
        walletAddress: walletLower
      });
    }

    // Log login on blockchain
    const ipHash = crypto.createHash('sha256').update(req.ip).digest('hex');
    await blockchainService.loginUser(walletLower, ipHash);

    // Update user status
    user.status = 'online';
    user.lastSeen = new Date();
    await user.save();

    // Generate JWT token
    const token = user.generateAuthToken();

    res.json({
      message: 'Authentication successful',
      token,
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        rank: user.rank,
        unit: user.unit,
        blockchainAddress: user.blockchainAddress,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Verify signature error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

/**
 * Register user with blockchain
 */
router.post('/register-blockchain', async (req, res) => {
  try {
    const { 
      walletAddress, 
      username, 
      fullName, 
      password,
      role, 
      rank, 
      unit 
    } = req.body;

    // Validate required fields
    if (!walletAddress || !username || !fullName || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { username },
        { blockchainAddress: walletAddress.toLowerCase() }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Register on blockchain first
    const blockchainResult = await blockchainService.registerUser(
      walletAddress,
      username,
      role || 'military_personnel',
      rank || '',
      unit || ''
    );

    // Create user in database
    const user = new User({
      username,
      password,
      fullName,
      role: role || 'military_personnel',
      rank: rank || null,
      unit: unit || null,
      blockchainAddress: walletAddress.toLowerCase(),
      isVerified: role === 'hq_staff', // Auto-verify HQ staff
      status: 'online',
      lastSeen: new Date()
    });

    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        rank: user.rank,
        unit: user.unit,
        blockchainAddress: user.blockchainAddress
      },
      blockchain: blockchainResult
    });
  } catch (error) {
    console.error('Blockchain registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * Get blockchain user info
 */
router.get('/user/:walletAddress', auth, async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const blockchainUser = await blockchainService.getUser(walletAddress);

    if (!blockchainUser) {
      return res.status(404).json({ error: 'User not found on blockchain' });
    }

    res.json(blockchainUser);
  } catch (error) {
    console.error('Get blockchain user error:', error);
    res.status(500).json({ error: 'Failed to fetch user from blockchain' });
  }
});

/**
 * Get user message count from blockchain
 */
router.get('/message-count/:walletAddress', auth, async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const count = await blockchainService.getUserMessageCount(walletAddress);

    res.json({ walletAddress, messageCount: count });
  } catch (error) {
    console.error('Get message count error:', error);
    res.status(500).json({ error: 'Failed to fetch message count' });
  }
});

/**
 * Verify message on blockchain
 */
router.post('/verify-message', auth, async (req, res) => {
  try {
    const { messageHash } = req.body;

    if (!messageHash) {
      return res.status(400).json({ error: 'Message hash required' });
    }

    const verification = await blockchainService.verifyMessage(messageHash);

    if (!verification || !verification.exists) {
      return res.status(404).json({ error: 'Message not found on blockchain' });
    }

    res.json({
      verified: true,
      ...verification
    });
  } catch (error) {
    console.error('Verify message error:', error);
    res.status(500).json({ error: 'Failed to verify message' });
  }
});

/**
 * Get blockchain status
 */
router.get('/status', async (req, res) => {
  try {
    res.json({
      initialized: blockchainService.isInitialized,
      contractAddress: blockchainService.contractAddress,
      network: process.env.BLOCKCHAIN_NETWORK || 'localhost',
      rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get blockchain status' });
  }
});

module.exports = router;
