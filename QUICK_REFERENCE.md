# 🚀 Quick Reference Guide

## 📋 Quick Commands

### Start Application
```bash
npm run dev                    # Start both server and client
npm run server                 # Start server only
npm run client                 # Start client only
npm run seed                   # Seed database with demo data
```

### Blockchain Commands
```bash
cd blockchain
npx hardhat node              # Start local blockchain
npm run deploy:local          # Deploy to localhost
npm run deploy:sepolia        # Deploy to Sepolia testnet
npx hardhat test              # Run contract tests
npx hardhat clean             # Clean build artifacts
```

### Installation
```bash
npm run install-all           # Install all dependencies
npm install                   # Install backend dependencies
cd client && npm install      # Install frontend dependencies
cd blockchain && npm install  # Install blockchain dependencies
```

---

## 🔑 Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| **HQ Staff** | `hq.admin` | `admin123` |
| **Military** | `soldier.john` | `soldier123` |
| **Military** | `captain.smith` | `captain123` |
| **Family** | `family.jane` | `family123` |

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend** | http://localhost:5000 |
| **Traditional Login** | http://localhost:3000/login |
| **Blockchain Login** | http://localhost:3000/blockchain-login |
| **Dashboard** | http://localhost:3000/dashboard |

---

## 🔗 Blockchain Quick Setup

### 1. Start Blockchain
```bash
cd blockchain
npx hardhat node
```
**Keep this terminal running!**

### 2. Deploy Contract
```bash
# In new terminal
cd blockchain
npm run deploy:local
```

### 3. Configure MetaMask
- **Network Name:** Localhost 8545
- **RPC URL:** http://127.0.0.1:8545
- **Chain ID:** 1337
- **Currency:** ETH

### 4. Import Test Account
Copy private key from Hardhat output and import to MetaMask

---

## 📊 Key Features at a Glance

### 🔐 Security
- ✅ Blockchain authentication
- ✅ VPN tunneling (8 servers)
- ✅ AES-256 encryption
- ✅ Virtual IP masking

### 💬 Messaging
- ✅ Real-time chat
- ✅ Reactions & threading
- ✅ File sharing (10MB)
- ✅ Message editing/deletion

### 📈 Analytics
- ✅ User activity tracking
- ✅ Message frequency
- ✅ Geo-distribution maps
- ✅ VPN statistics

### 🌐 Network
- ✅ Multi-hop routing (2-4 hops)
- ✅ Auto route selection
- ✅ Manual route refresh
- ✅ Health monitoring

---

## 🛠️ Tech Stack Summary

**Backend:** Node.js, Express, MongoDB, Socket.io, JWT, bcrypt, crypto-js, ethers.js

**Frontend:** React, Socket.io-client, Axios, Recharts, Leaflet, Lucide React

**Blockchain:** Solidity, Hardhat, Ethers.js, MetaMask, OpenZeppelin

---

## 📡 API Endpoints Quick Reference

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Blockchain
```
POST /api/blockchain/request-nonce
POST /api/blockchain/verify-signature
POST /api/blockchain/register-blockchain
GET  /api/blockchain/user/:address
GET  /api/blockchain/status
```

### VPN
```
GET  /api/vpn/tunnel/info
POST /api/vpn/tunnel/refresh
GET  /api/vpn/tunnel/health
GET  /api/vpn/tunnels/stats
```

### Users
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

### Chat Rooms
```
GET  /api/chatrooms
POST /api/chatrooms
GET  /api/chatrooms/:id
PUT  /api/chatrooms/:id
```

### Messages
```
GET    /api/messages/:chatRoomId
POST   /api/messages
PUT    /api/messages/:id
DELETE /api/messages/:id
```

---

## 🔍 Troubleshooting Quick Fixes

### "Port already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "MongoDB connection error"
```bash
# Start MongoDB service
net start MongoDB
```

### "MetaMask not detected"
1. Install MetaMask extension
2. Refresh browser
3. Unlock MetaMask

### "Contract not found"
```bash
cd blockchain
npm run deploy:local
```

### "Wrong network"
Switch MetaMask to "Localhost 8545" network

---

## 📚 Documentation Files

| File | Description |
|------|-------------|
| **README.md** | Main documentation (this file) |
| **BLOCKCHAIN_SETUP.md** | Blockchain setup guide |
| **VPN_TUNNEL_GUIDE.md** | VPN tunnel technical guide |
| **BLOCKCHAIN_IMPLEMENTATION.md** | Implementation details |
| **FEATURES_SUMMARY.md** | All features overview |
| **WHAT_TO_DO_NEXT.md** | Step-by-step next steps |
| **QUICK_REFERENCE.md** | This quick reference |

---

## 🎯 Common Tasks

### Add New User (via API)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "password123",
    "fullName": "New User",
    "role": "military_personnel",
    "blockchainAddress": "0x..."
  }'
```

### Get VPN Tunnel Info
```bash
curl http://localhost:5000/api/vpn/tunnel/info \
  -H "Authorization: Bearer <your_token>"
```

### Refresh VPN Route
```bash
curl -X POST http://localhost:5000/api/vpn/tunnel/refresh \
  -H "Authorization: Bearer <your_token>"
```

---

## 🌍 VPN Server Locations

| Server | Location | IP | Latency |
|--------|----------|-----|---------|
| vpn-us-east | Virginia | 10.0.1.1 | 20ms |
| vpn-us-west | California | 10.0.2.1 | 35ms |
| vpn-eu-west | Ireland | 10.0.3.1 | 80ms |
| vpn-eu-central | Frankfurt | 10.0.4.1 | 90ms |
| vpn-asia-east | Tokyo | 10.0.5.1 | 150ms |
| vpn-asia-south | Singapore | 10.0.6.1 | 180ms |
| vpn-middle-east | Dubai | 10.0.7.1 | 120ms |
| vpn-australia | Sydney | 10.0.8.1 | 200ms |

---

## 🔐 Environment Variables Template

```env
# Server
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/secure-military-chat
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=your_32_character_encryption_key

# Blockchain (Local)
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
BLOCKCHAIN_NETWORK=localhost
BLOCKCHAIN_PRIVATE_KEY=0x...

# Blockchain (Testnet)
# BLOCKCHAIN_RPC_URL=https://rpc.sepolia.org
# BLOCKCHAIN_NETWORK=sepolia
# ETHERSCAN_API_KEY=your_api_key
```

---

## 🎨 Project Structure Overview

```
SECCURE CHAT/
├── blockchain/          # Smart contracts & deployment
├── server/             # Backend API & services
├── client/             # React frontend
├── uploads/            # Uploaded files
├── .env               # Environment variables
└── package.json       # Root dependencies
```

---

## 💡 Tips & Best Practices

### Development
- ✅ Use `npm run dev` for development
- ✅ Keep Hardhat node running for blockchain features
- ✅ Check server console for VPN tunnel logs
- ✅ Use browser console for debugging

### Security
- ✅ Never commit `.env` file
- ✅ Never share private keys
- ✅ Use testnets for development
- ✅ Test thoroughly before mainnet

### Performance
- ✅ Seed database for testing
- ✅ Monitor VPN tunnel statistics
- ✅ Check blockchain transaction logs
- ✅ Optimize file uploads

---

## 🚨 Important Notes

1. **Blockchain Features** - Require MetaMask and local blockchain
2. **VPN Tunneling** - Automatically active for all users
3. **File Size Limit** - 10MB per file
4. **Token Expiration** - JWT tokens expire after 7 days
5. **Demo Data** - Use `npm run seed` for testing

---

## 📞 Getting Help

1. Check documentation files
2. Review troubleshooting section
3. Check server/browser console logs
4. Open GitHub issue

---

**Quick Start:** `npm run install-all` → `npm run seed` → `npm run dev` → Open http://localhost:3000

**That's it! You're ready to go!** 🚀
