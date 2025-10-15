# 🔗 Blockchain Authentication Setup Guide

This guide will help you set up blockchain-based authentication for the Secure Military Chat application.

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **MetaMask** browser extension
3. **MongoDB** running locally
4. Basic understanding of Ethereum/blockchain concepts

## 🎯 What You'll Get

- ✅ **Decentralized Authentication** - No passwords, use your wallet
- ✅ **Smart Contract** - Solidity contract for user management
- ✅ **MetaMask Integration** - Sign in with your wallet
- ✅ **Message Logging** - All messages logged on blockchain
- ✅ **Cryptographic Verification** - Signature-based authentication

## 🚀 Quick Start (Local Development)

### Step 1: Install Blockchain Dependencies

```powershell
# Navigate to blockchain directory
cd blockchain

# Install Hardhat and dependencies
npm install
```

### Step 2: Start Local Blockchain

Open a new terminal and run:

```powershell
cd blockchain
npx hardhat node
```

This will:
- Start a local Ethereum network on `http://127.0.0.1:8545`
- Create 20 test accounts with 10,000 ETH each
- Display private keys for testing

**Keep this terminal running!**

### Step 3: Deploy Smart Contract

In another terminal:

```powershell
cd blockchain
npm run deploy:local
```

This will:
- Compile the `MilitaryAuth.sol` smart contract
- Deploy it to your local network
- Save the contract address and ABI to `server/blockchain/MilitaryAuth.json`

### Step 4: Configure Environment Variables

Update your `.env` file:

```env
# Blockchain Configuration
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
BLOCKCHAIN_NETWORK=localhost
BLOCKCHAIN_PRIVATE_KEY=<your_private_key_from_hardhat_node>
```

**Note:** Use one of the private keys displayed when you started `hardhat node`.

### Step 5: Install MetaMask

1. Install [MetaMask extension](https://metamask.io/download/)
2. Create or import a wallet
3. Add local network to MetaMask:
   - Network Name: `Localhost 8545`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`

### Step 6: Import Test Account

1. In MetaMask, click "Import Account"
2. Paste one of the private keys from Hardhat node
3. You should see 10,000 ETH balance

### Step 7: Start the Application

```powershell
# Install all dependencies (if not done)
npm install

# Start both server and client
npm run dev
```

### Step 8: Test Blockchain Login

1. Navigate to `http://localhost:3000/blockchain-login`
2. Click "Connect MetaMask"
3. Approve the connection in MetaMask
4. Click "Authenticate with Blockchain"
5. Sign the message in MetaMask
6. You'll be authenticated!

## 📱 Using the Application

### First Time Registration

If you haven't registered yet:

1. Go to blockchain login page
2. Connect your wallet
3. You'll see "Account not found"
4. Click "Register New Account"
5. Fill in your details
6. Sign the registration transaction
7. You're registered on the blockchain!

### Subsequent Logins

1. Connect wallet
2. Sign authentication message
3. Instant login!

## 🌐 Deploying to Testnet (Sepolia)

### Step 1: Get Test ETH

1. Visit [Sepolia Faucet](https://sepoliafaucet.com/)
2. Enter your wallet address
3. Receive free test ETH

### Step 2: Configure Sepolia

Update `.env`:

```env
BLOCKCHAIN_RPC_URL=https://rpc.sepolia.org
BLOCKCHAIN_NETWORK=sepolia
BLOCKCHAIN_PRIVATE_KEY=<your_wallet_private_key>
SEPOLIA_RPC_URL=https://rpc.sepolia.org
ETHERSCAN_API_KEY=<your_etherscan_api_key>
```

### Step 3: Deploy to Sepolia

```powershell
cd blockchain
npm run deploy:sepolia
```

### Step 4: Verify Contract (Optional)

The deployment script will automatically verify your contract on Etherscan.

### Step 5: Update Frontend

The contract address is automatically saved. Just restart your server!

## 🔧 Smart Contract Features

### User Management

```solidity
// Register new user
function registerUser(string username, string role, string rank, string unit)

// Login (creates session)
function login(string ipHash)

// Logout
function logout()
```

### Message Logging

```solidity
// Log message on blockchain
function logMessage(address receiver, bytes32 messageHash, string encryptionType)

// Verify message authenticity
function verifyMessage(bytes32 messageHash)
```

### Admin Functions (HQ Staff Only)

```solidity
// Verify user
function verifyUser(address userAddress)

// Change user role
function changeUserRole(address userAddress, string newRole)

// Deactivate/Activate user
function deactivateUser(address userAddress)
function activateUser(address userAddress)
```

## 🔐 Security Features

### 1. Signature-Based Authentication

- User signs a nonce with their private key
- Server verifies the signature
- No passwords stored or transmitted

### 2. On-Chain User Registry

- All users registered on blockchain
- Immutable registration records
- Transparent user management

### 3. Message Integrity

- Message hashes stored on blockchain
- Cryptographic proof of message authenticity
- Tamper-proof message logs

### 4. Role-Based Access Control

- Smart contract enforces permissions
- HQ Staff have admin privileges
- Decentralized authorization

## 📊 Blockchain Analytics

The application tracks:

- **User Sessions** - Login/logout events
- **Message Count** - Total messages per user
- **Verification Status** - User verification on blockchain
- **Role Changes** - Admin actions logged

Access via API:

```javascript
// Get blockchain user info
GET /api/blockchain/user/:walletAddress

// Get message count
GET /api/blockchain/message-count/:walletAddress

// Verify message
POST /api/blockchain/verify-message
{
  "messageHash": "0x..."
}
```

## 🛠️ Troubleshooting

### MetaMask Not Detected

**Problem:** "MetaMask is not installed" error

**Solution:**
1. Install MetaMask extension
2. Refresh the page
3. Make sure MetaMask is unlocked

### Wrong Network

**Problem:** Transaction fails or network mismatch

**Solution:**
1. Open MetaMask
2. Switch to correct network (Localhost 8545 or Sepolia)
3. Try again

### Transaction Failed

**Problem:** "Transaction failed" error

**Solution:**
1. Check you have enough ETH for gas
2. Verify contract is deployed
3. Check console for detailed error
4. Reset MetaMask account (Settings > Advanced > Reset Account)

### Contract Not Found

**Problem:** "Smart contract not deployed" message

**Solution:**
1. Make sure Hardhat node is running
2. Deploy contract: `npm run deploy:local`
3. Restart the server
4. Check `server/blockchain/MilitaryAuth.json` exists

### Nonce Expired

**Problem:** "Nonce expired" error

**Solution:**
- Request a new nonce (refresh the page)
- Sign the message within 5 minutes

## 🔄 Simulation Mode

If blockchain is not available, the application runs in **simulation mode**:

- All blockchain functions return simulated data
- No actual transactions are made
- Perfect for testing without blockchain setup

To enable simulation mode:
- Don't deploy the smart contract
- Server will automatically detect and use simulation

## 📝 Development Tips

### Testing Smart Contract

```powershell
cd blockchain
npx hardhat test
```

### Compile Contract

```powershell
cd blockchain
npx hardhat compile
```

### Clean Build

```powershell
cd blockchain
npx hardhat clean
```

### View Contract on Etherscan

After deploying to Sepolia:
1. Copy contract address from deployment output
2. Visit `https://sepolia.etherscan.io/address/<contract_address>`
3. View all transactions and contract code

## 🌟 Advanced Features

### Custom Network Configuration

Edit `blockchain/hardhat.config.js` to add custom networks:

```javascript
networks: {
  mynetwork: {
    url: "https://rpc.mynetwork.com",
    accounts: [process.env.PRIVATE_KEY],
    chainId: 12345
  }
}
```

### Gas Optimization

The smart contract is optimized for:
- Minimal storage usage
- Efficient data structures
- Batch operations support

### Event Listening

Listen to blockchain events in real-time:

```javascript
contract.on("UserRegistered", (userAddress, username, role, timestamp) => {
  console.log(`New user registered: ${username}`);
});
```

## 📚 Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Sepolia Testnet](https://sepolia.dev/)

## 🆘 Need Help?

### Common Issues

1. **Gas Estimation Failed**
   - Check contract is deployed
   - Verify you're on correct network
   - Ensure sufficient ETH balance

2. **Signature Verification Failed**
   - Make sure you're signing with the correct wallet
   - Check wallet address matches registered address
   - Request a fresh nonce

3. **Contract Interaction Failed**
   - Verify contract address in `MilitaryAuth.json`
   - Check RPC URL is accessible
   - Ensure private key has permissions

### Debug Mode

Enable debug logging:

```env
DEBUG=true
LOG_LEVEL=debug
```

## 🎉 Success!

You now have a fully functional blockchain-authenticated military chat application!

### What's Next?

- Deploy to mainnet (requires real ETH)
- Add more smart contract features
- Implement DAO governance
- Create NFT badges for ranks
- Add token-gated channels

---

**Remember:** Never share your private keys or seed phrases!
