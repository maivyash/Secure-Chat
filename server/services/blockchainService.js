const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

class BlockchainService {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.signer = null;
    this.contractAddress = null;
    this.isInitialized = false;
  }

  /**
   * Initialize blockchain connection
   */
  async initialize() {
    try {
      // Load contract ABI and address
      const contractPath = path.join(__dirname, '../blockchain/MilitaryAuth.json');
      
      if (!fs.existsSync(contractPath)) {
        console.warn('Smart contract not deployed. Using simulation mode.');
        this.isInitialized = false;
        return false;
      }

      const contractData = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
      
      // Connect to blockchain network
      const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      
      // Use private key if available, otherwise use provider's signer
      if (process.env.BLOCKCHAIN_PRIVATE_KEY) {
        this.signer = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, this.provider);
      } else {
        this.signer = await this.provider.getSigner();
      }

      // Initialize contract
      this.contractAddress = contractData.contractAddress;
      this.contract = new ethers.Contract(
        this.contractAddress,
        contractData.abi,
        this.signer
      );

      this.isInitialized = true;
      console.log('✅ Blockchain service initialized');
      console.log('Contract Address:', this.contractAddress);
      console.log('Network:', contractData.network);
      
      return true;
    } catch (error) {
      console.error('Blockchain initialization error:', error.message);
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * Register user on blockchain
   */
  async registerUser(walletAddress, username, role, rank, unit) {
    if (!this.isInitialized) {
      return this.simulateRegistration(walletAddress, username, role);
    }

    try {
      const tx = await this.contract.registerUser(username, role, rank || '', unit || '');
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Blockchain registration error:', error);
      throw new Error('Failed to register user on blockchain');
    }
  }

  /**
   * User login on blockchain
   */
  async loginUser(walletAddress, ipHash) {
    if (!this.isInitialized) {
      return this.simulateLogin(walletAddress);
    }

    try {
      const tx = await this.contract.login(ipHash);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Blockchain login error:', error);
      throw new Error('Failed to log login on blockchain');
    }
  }

  /**
   * User logout on blockchain
   */
  async logoutUser(walletAddress) {
    if (!this.isInitialized) {
      return { success: true, simulated: true };
    }

    try {
      const tx = await this.contract.logout();
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (error) {
      console.error('Blockchain logout error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Log message on blockchain
   */
  async logMessage(senderAddress, receiverAddress, messageHash, encryptionType = 'AES-256') {
    if (!this.isInitialized) {
      return this.simulateMessageLog(messageHash);
    }

    try {
      const messageHashBytes = ethers.id(messageHash);
      const tx = await this.contract.logMessage(receiverAddress, messageHashBytes, encryptionType);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        messageHash: messageHashBytes
      };
    } catch (error) {
      console.error('Blockchain message log error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify user on blockchain
   */
  async verifyUser(userAddress) {
    if (!this.isInitialized) {
      return { success: true, simulated: true };
    }

    try {
      const tx = await this.contract.verifyUser(userAddress);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (error) {
      console.error('Blockchain verification error:', error);
      throw new Error('Failed to verify user on blockchain');
    }
  }

  /**
   * Get user from blockchain
   */
  async getUser(walletAddress) {
    if (!this.isInitialized) {
      return null;
    }

    try {
      const user = await this.contract.getUser(walletAddress);
      return {
        username: user[0],
        role: user[1],
        rank: user[2],
        unit: user[3],
        registeredAt: Number(user[4]),
        lastLogin: Number(user[5]),
        isActive: user[6],
        isVerified: user[7]
      };
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  /**
   * Check if user is registered
   */
  async isUserRegistered(walletAddress) {
    if (!this.isInitialized) {
      return false;
    }

    try {
      return await this.contract.registeredUsers(walletAddress);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user message count
   */
  async getUserMessageCount(walletAddress) {
    if (!this.isInitialized) {
      return 0;
    }

    try {
      const count = await this.contract.getUserMessageCount(walletAddress);
      return Number(count);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Verify message authenticity
   */
  async verifyMessage(messageHash) {
    if (!this.isInitialized) {
      return null;
    }

    try {
      const messageHashBytes = ethers.id(messageHash);
      const result = await this.contract.verifyMessage(messageHashBytes);
      
      return {
        sender: result[0],
        receiver: result[1],
        timestamp: Number(result[2]),
        exists: result[3]
      };
    } catch (error) {
      console.error('Verify message error:', error);
      return null;
    }
  }

  /**
   * Sign message with wallet
   */
  async signMessage(message, privateKey) {
    try {
      const wallet = new ethers.Wallet(privateKey);
      const signature = await wallet.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Sign message error:', error);
      throw new Error('Failed to sign message');
    }
  }

  /**
   * Verify signature
   */
  verifySignature(message, signature, expectedAddress) {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch (error) {
      console.error('Verify signature error:', error);
      return false;
    }
  }

  /**
   * Generate nonce for authentication
   */
  generateNonce() {
    return `Sign this message to authenticate: ${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  // Simulation methods for when blockchain is not available
  simulateRegistration(walletAddress, username, role) {
    return {
      success: true,
      simulated: true,
      transactionHash: '0x' + Math.random().toString(16).substring(2, 66),
      blockNumber: Math.floor(Math.random() * 1000000),
      gasUsed: '50000'
    };
  }

  simulateLogin(walletAddress) {
    return {
      success: true,
      simulated: true,
      transactionHash: '0x' + Math.random().toString(16).substring(2, 66),
      blockNumber: Math.floor(Math.random() * 1000000),
      timestamp: Date.now()
    };
  }

  simulateMessageLog(messageHash) {
    return {
      success: true,
      simulated: true,
      transactionHash: '0x' + Math.random().toString(16).substring(2, 66),
      blockNumber: Math.floor(Math.random() * 1000000),
      messageHash: '0x' + messageHash
    };
  }
}

// Export singleton instance
module.exports = new BlockchainService();
