import { ethers } from 'ethers';

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.account = null;
  }

  /**
   * Check if MetaMask is installed
   */
  isMetaMaskInstalled() {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }

  /**
   * Connect to MetaMask wallet
   */
  async connectWallet() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      // Initialize provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.account = accounts[0];

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          this.disconnect();
        } else {
          this.account = accounts[0];
          window.location.reload();
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      return {
        address: this.account,
        provider: this.provider,
        signer: this.signer
      };
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  }

  /**
   * Disconnect wallet
   */
  disconnect() {
    this.provider = null;
    this.signer = null;
    this.account = null;
  }

  /**
   * Get current account
   */
  async getCurrentAccount() {
    if (!this.isMetaMaskInstalled()) {
      return null;
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      });
      return accounts[0] || null;
    } catch (error) {
      console.error('Get account error:', error);
      return null;
    }
  }

  /**
   * Sign message with wallet
   */
  async signMessage(message) {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await this.signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Sign message error:', error);
      throw error;
    }
  }

  /**
   * Get network information
   */
  async getNetwork() {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    try {
      const network = await this.provider.getNetwork();
      return {
        chainId: Number(network.chainId),
        name: network.name
      };
    } catch (error) {
      console.error('Get network error:', error);
      throw error;
    }
  }

  /**
   * Get account balance
   */
  async getBalance(address) {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    try {
      const balance = await this.provider.getBalance(address || this.account);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Get balance error:', error);
      throw error;
    }
  }

  /**
   * Switch to specific network
   */
  async switchNetwork(chainId) {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        throw new Error('Network not found in MetaMask. Please add it manually.');
      }
      throw error;
    }
  }

  /**
   * Add custom network to MetaMask
   */
  async addNetwork(networkConfig) {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig],
      });
    } catch (error) {
      console.error('Add network error:', error);
      throw error;
    }
  }

  /**
   * Format address for display
   */
  formatAddress(address, length = 4) {
    if (!address) return '';
    return `${address.substring(0, length + 2)}...${address.substring(address.length - length)}`;
  }

  /**
   * Validate Ethereum address
   */
  isValidAddress(address) {
    return ethers.isAddress(address);
  }
}

// Network configurations
export const NETWORKS = {
  LOCALHOST: {
    chainId: '0x539', // 1337
    chainName: 'Localhost 8545',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['http://127.0.0.1:8545'],
    blockExplorerUrls: []
  },
  SEPOLIA: {
    chainId: '0xaa36a7', // 11155111
    chainName: 'Sepolia Testnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://rpc.sepolia.org'],
    blockExplorerUrls: ['https://sepolia.etherscan.io']
  },
  MUMBAI: {
    chainId: '0x13881', // 80001
    chainName: 'Polygon Mumbai',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com']
  }
};

export default new Web3Service();
