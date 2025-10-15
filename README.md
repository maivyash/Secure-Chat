# 🛡️ SecureComm - Military-Grade Chat Application

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)

**A next-generation MERN stack secure chat application with blockchain authentication, VPN tunneling, end-to-end encryption, and military-grade security features.**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Security](#-security)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Quick Start](#-quick-start)
- [User Roles](#-user-roles)
- [Core Features](#-core-features)
  - [Blockchain Authentication](#-blockchain-authentication)
  - [VPN Tunneling](#-vpn-tunneling)
  - [End-to-End Encryption](#-end-to-end-encryption)
  - [Geo-Location Tracking](#-geo-location-tracking)
  - [Real-time Messaging](#-real-time-messaging)
  - [File Sharing](#-file-sharing)
  - [Analytics Dashboard](#-analytics-dashboard)
- [API Documentation](#-api-documentation)
- [Security](#️-security)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**SecureComm** is a comprehensive military-themed chat application featuring:

- 🔗 **Blockchain Authentication** - Ethereum smart contracts for decentralized identity
- 🔒 **VPN Tunneling** - Multi-hop routing through 8 global servers
- 🔐 **End-to-End Encryption** - AES-256-GCM multi-layer encryption
- 📍 **Geo-Location Tracking** - Real-time message origin tracking
- 📊 **Advanced Analytics** - Real-time dashboard for HQ Staff
- 💬 **Modern Chat Features** - Reactions, threading, editing, pinning
- 📁 **Secure File Sharing** - Encrypted file uploads with preview
- 🔔 **Real-time Notifications** - Priority-based notification system

---

## ✨ Key Features

### 🔐 Security First
- ✅ Blockchain-based authentication using Ethereum smart contracts
- ✅ MetaMask wallet integration for passwordless login
- ✅ Multi-layer AES-256-GCM encryption for all communications
- ✅ VPN tunneling with 2-4 hop routing through global servers
- ✅ Virtual IP assignment for anonymity
- ✅ Cryptographic signatures for message verification
- ✅ Immutable audit logs on blockchain

### 💬 Advanced Messaging
- ✅ Real-time messaging with Socket.io
- ✅ Message reactions with emoji support
- ✅ Message threading for organized conversations
- ✅ Message editing and deletion
- ✅ Message pinning for important updates
- ✅ Message forwarding between chats
- ✅ Message search with filters
- ✅ Typing indicators and read receipts

### 📁 File Management
- ✅ Multiple file uploads (images, documents, videos)
- ✅ Drag & drop support
- ✅ File preview with thumbnails
- ✅ Progress indicators for uploads
- ✅ 10MB file size limit with validation
- ✅ Encrypted file storage

### 📊 Analytics & Monitoring
- ✅ Real-time dashboard for HQ Staff
- ✅ User activity tracking
- ✅ Message frequency analytics
- ✅ Geographic distribution visualization
- ✅ VPN tunnel statistics
- ✅ Blockchain transaction logs

### 🌐 Network Features
- ✅ 8 global VPN servers (US, EU, Asia, Middle East, Australia)
- ✅ Multi-hop routing (2-4 hops per message)
- ✅ Automatic route selection
- ✅ Manual route refresh
- ✅ Tunnel health monitoring
- ✅ Geo-location tagging for all messages

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **crypto-js** - Message encryption
- **ethers.js** - Blockchain integration
- **multer** - File uploads

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **Socket.io-client** - Real-time client
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Leaflet** - Maps
- **Lucide React** - Icons
- **date-fns** - Date formatting
- **ethers.js** - Web3 integration

### Blockchain
- **Solidity** - Smart contract language
- **Hardhat** - Development environment
- **Ethers.js** - Ethereum library
- **MetaMask** - Wallet integration
- **OpenZeppelin** - Contract libraries

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  React   │  │ Socket.io│  │ MetaMask │  │   VPN    │  │
│  │   App    │  │  Client  │  │  Wallet  │  │  Client  │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
└───────┼─────────────┼─────────────┼─────────────┼─────────┘
        │             │             │             │
        │ HTTPS       │ WebSocket   │ Web3        │ Encrypted
        │             │             │             │
┌───────┼─────────────┼─────────────┼─────────────┼─────────┐
│       ▼             ▼             ▼             ▼         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Express  │  │ Socket.io│  │Blockchain│  │   VPN    │ │
│  │   API    │  │  Server  │  │ Service  │  │  Tunnel  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
│       │             │             │             │         │
│       └─────────────┴─────────────┴─────────────┘         │
│                         ▼                                  │
│                  ┌──────────────┐                          │
│                  │   MongoDB    │                          │
│                  │   Database   │                          │
│                  └──────────────┘                          │
│                      SERVER                                │
└────────────────────────┼───────────────────────────────────┘
                         │
                         ▼
              ┌───────────────────────┐
              │  Ethereum Blockchain  │
              │   Smart Contracts     │
              └───────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16 or higher
- **MongoDB** running locally or MongoDB Atlas
- **MetaMask** browser extension (for blockchain features)
- **npm** or **yarn**

### Option 1: Quick Setup (Without Blockchain)

```bash
# 1. Clone the repository
git clone <repository-url>
cd SECCURE-CHAT

# 2. Install all dependencies
npm run install-all

# 3. Create .env file
cp .env.example .env

# 4. Seed database with demo data
npm run seed

# 5. Start the application
npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

**Demo Credentials:**
| Role | Username | Password |
|------|----------|----------|
| HQ Staff | `hq.admin` | `admin123` |
| Military | `soldier.john` | `soldier123` |
| Family | `family.jane` | `family123` |

### Option 2: Full Setup (With Blockchain)

```bash
# 1-4. Same as above

# 5. Install blockchain dependencies
cd blockchain
npm install

# 6. Start local blockchain (keep running)
npx hardhat node

# 7. Deploy smart contract (new terminal)
npm run deploy:local

# 8. Install & configure MetaMask
# - Add network: Localhost 8545
# - RPC: http://127.0.0.1:8545
# - Chain ID: 1337
# - Import test account from Hardhat

# 9. Start the application
cd ..
npm run dev
```

**Access blockchain login:**
- Traditional: http://localhost:3000/login
- Blockchain: http://localhost:3000/blockchain-login

---

## 👥 User Roles

### 🏅 HQ Staff (Administrators)
**Full system access with administrative privileges**

**Capabilities:**
- ✅ User management (create, edit, delete, verify)
- ✅ Access to analytics dashboard
- ✅ View all chat rooms and messages
- ✅ Monitor VPN tunnel statistics
- ✅ View blockchain transaction logs
- ✅ Geo-location monitoring
- ✅ System-wide notifications
- ✅ User verification on blockchain
- ✅ Role management

**Dashboard Features:**
- Real-time user activity graphs
- Message frequency analytics
- Geographic distribution maps
- VPN tunnel statistics
- Blockchain transaction history
- Top active users
- System health monitoring

### 🪖 Military Personnel
**Standard users with full communication features**

**Capabilities:**
- ✅ Create and join group chats
- ✅ Send encrypted messages
- ✅ Share files (images, documents, videos)
- ✅ Message reactions and threading
- ✅ Edit and delete own messages
- ✅ Pin important messages
- ✅ Search messages
- ✅ View own geo-location
- ✅ Access VPN tunnel info
- ✅ Profile management

### 👨‍👩‍👧‍👦 Family Members
**Limited access for family communications**

**Capabilities:**
- ✅ Direct messaging with military personnel
- ✅ Basic chat features
- ✅ File sharing
- ✅ Message reactions
- ✅ Profile management
- ❌ Cannot create group chats
- ❌ Limited analytics access

---

## 🔗 Blockchain Authentication

### Overview
Decentralized authentication using Ethereum smart contracts and MetaMask wallet integration.

### Features
- ✅ **Passwordless Login** - Sign in with your wallet
- ✅ **Smart Contract Registry** - User data stored on blockchain
- ✅ **Cryptographic Signatures** - Proof of identity
- ✅ **Nonce-based Authentication** - Prevent replay attacks
- ✅ **Immutable Audit Trail** - All actions logged on-chain
- ✅ **Role-based Access Control** - Enforced by smart contract

### Smart Contract Functions

```solidity
// User Management
registerUser(username, role, rank, unit)
login(ipHash)
logout()
verifyUser(userAddress)
changeUserRole(userAddress, newRole)

// Message Logging
logMessage(receiver, messageHash, encryptionType)
verifyMessage(messageHash)
getMessageCount(userAddress)

// Admin Functions (HQ Staff Only)
activateUser(userAddress)
deactivateUser(userAddress)
```

### Authentication Flow

```
1. User clicks "Connect MetaMask"
   ↓
2. MetaMask popup appears
   ↓
3. User approves connection
   ↓
4. Server generates random nonce
   ↓
5. User signs nonce with private key
   ↓
6. Server verifies signature
   ↓
7. Check if user exists on blockchain
   ↓
8. Generate JWT token
   ↓
9. User authenticated!
```

### Supported Networks
- **Localhost** (Development) - Chain ID: 1337
- **Sepolia Testnet** - Chain ID: 11155111
- **Mumbai Testnet** (Polygon) - Chain ID: 80001
- **Ethereum Mainnet** - Chain ID: 1
- **Polygon Mainnet** - Chain ID: 137

**📚 Detailed Guide:** See [BLOCKCHAIN_SETUP.md](BLOCKCHAIN_SETUP.md)

---

## 🔒 VPN Tunneling

### Overview
Multi-hop VPN routing with multi-layer encryption for maximum privacy and security.

### Features
- ✅ **8 Global VPN Servers** - Worldwide coverage
- ✅ **Multi-hop Routing** - 2-4 hops per message
- ✅ **Multi-layer Encryption** - AES-256-GCM per hop
- ✅ **Virtual IP Assignment** - Hide real IP addresses
- ✅ **Automatic Route Selection** - Optimal path selection
- ✅ **Manual Route Refresh** - Change route on demand
- ✅ **Tunnel Health Monitoring** - Real-time status
- ✅ **Statistics Tracking** - Bandwidth and latency

### VPN Server Locations

| Location | IP | Latency |
|----------|-----|----------|
| 🇺🇸 US East (Virginia) | 10.0.1.1 | 20ms |
| 🇺🇸 US West (California) | 10.0.2.1 | 35ms |
| 🇮🇪 EU West (Ireland) | 10.0.3.1 | 80ms |
| 🇩🇪 EU Central (Frankfurt) | 10.0.4.1 | 90ms |
| 🇯🇵 Asia East (Tokyo) | 10.0.5.1 | 150ms |
| 🇸🇬 Asia South (Singapore) | 10.0.6.1 | 180ms |
| 🇦🇪 Middle East (Dubai) | 10.0.7.1 | 120ms |
| 🇦🇺 Australia (Sydney) | 10.0.8.1 | 200ms |

### How VPN Tunneling Works

```
User Message: "Hello"
    ↓
Encrypt with AES-256
    ↓
Route through VPN tunnel:
    ↓
[Hop 1] US East → Encrypt Layer 1
    ↓
[Hop 2] EU West → Encrypt Layer 2
    ↓
[Hop 3] Asia East → Encrypt Layer 3
    ↓
Transmit encrypted packet
    ↓
[Hop 3] Asia East → Decrypt Layer 3
    ↓
[Hop 2] EU West → Decrypt Layer 2
    ↓
[Hop 1] US East → Decrypt Layer 1
    ↓
Deliver: "Hello"
```

**📚 Detailed Guide:** See [VPN_TUNNEL_GUIDE.md](VPN_TUNNEL_GUIDE.md)

---

## 🔐 End-to-End Encryption

### Encryption Methods

#### 1. Message Encryption
- **Algorithm:** AES-256-CBC
- **Key:** 32-byte encryption key
- **IV:** Random 16-byte initialization vector
- **Process:** Encrypt → Base64 encode → Store

#### 2. VPN Tunnel Encryption
- **Algorithm:** AES-256-GCM (per hop)
- **Layers:** 2-4 layers depending on hops
- **Authentication:** Built-in with GCM mode
- **Key Derivation:** SHA-256 hash of tunnel key + hop ID

#### 3. File Encryption
- **Algorithm:** AES-256
- **Storage:** Encrypted on server
- **Access:** Decrypted on-the-fly

---

## 📍 Geo-Location Tracking

### Features
- ✅ **Automatic Geo-tagging** - All messages tagged with location
- ✅ **City & Country Detection** - Accurate location data
- ✅ **Coordinates Logging** - Latitude and longitude
- ✅ **Map Visualization** - Interactive maps on dashboard
- ✅ **Privacy Controls** - Users can disable location

### Location Data Structure

```javascript
{
  city: "New York",
  country: "United States",
  coordinates: {
    lat: 40.7128,
    lng: -74.0060
  },
  timestamp: "2024-01-15T10:30:00Z"
}
```

---

## 💬 Real-time Messaging

### Socket.io Events

#### Client → Server
```javascript
'user:join'           // User connects
'message:send'        // Send message
'message:reaction'    // Add reaction
'typing:start'        // Start typing
'typing:stop'         // Stop typing
'chatroom:join'       // Join chat room
'chatroom:leave'      // Leave chat room
```

#### Server → Client
```javascript
'message:receive'     // New message
'message:reaction:update'  // Reaction added
'user:status'         // User online/offline
'typing:user'         // User typing
'notification:receive'  // New notification
'vpn:tunnel:created'  // VPN tunnel ready
```

### Message Features

#### Basic
- ✅ Text messages
- ✅ File attachments
- ✅ Emoji support
- ✅ Markdown formatting

#### Advanced
- ✅ **Reactions** - React with emojis
- ✅ **Threading** - Reply to specific messages
- ✅ **Editing** - Edit sent messages
- ✅ **Deletion** - Delete messages
- ✅ **Pinning** - Pin important messages
- ✅ **Forwarding** - Forward to other chats
- ✅ **Search** - Full-text search

---

## 📁 File Sharing

### Supported File Types
- **Images:** JPG, PNG, GIF, WebP, SVG
- **Documents:** PDF, DOC, DOCX, TXT, XLS, XLSX
- **Videos:** MP4, WebM, AVI
- **Archives:** ZIP, RAR

### Features
- ✅ **Drag & Drop** - Easy file upload
- ✅ **Multiple Files** - Upload multiple at once
- ✅ **Preview** - Image and document preview
- ✅ **Progress Bar** - Upload progress indicator
- ✅ **Size Limit** - 10MB per file
- ✅ **Validation** - File type and size checks
- ✅ **Encryption** - Files encrypted at rest

---

## 📊 Analytics Dashboard

### Available Metrics

#### User Analytics
- **Active Users** - Currently online
- **Total Users** - All registered users
- **User Growth** - Registration trends
- **User Distribution** - By role

#### Message Analytics
- **Total Messages** - All-time count
- **Messages Today** - Daily count
- **Message Frequency** - Hourly/daily trends
- **Top Active Users** - Most messages sent

#### System Analytics
- **Chat Rooms** - Total count
- **VPN Tunnels** - Active tunnels
- **Blockchain Transactions** - On-chain activity
- **File Uploads** - Total storage used

### Visualizations
- **Line Charts** - Message activity over time
- **Pie Charts** - User role distribution
- **Bar Charts** - Top active users
- **Heat Maps** - Geographic distribution
- **Real-time Counters** - Live statistics

---

## 📡 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register              Register new user
POST   /api/auth/login                 Login with credentials
POST   /api/auth/logout                Logout user
GET    /api/auth/me                    Get current user
```

### Blockchain Endpoints

```
POST   /api/blockchain/request-nonce          Request auth nonce
POST   /api/blockchain/verify-signature       Verify wallet signature
POST   /api/blockchain/register-blockchain    Register on blockchain
GET    /api/blockchain/user/:address          Get blockchain user
GET    /api/blockchain/message-count/:address Message count
POST   /api/blockchain/verify-message         Verify message hash
GET    /api/blockchain/status                 Blockchain status
```

### VPN Endpoints

```
GET    /api/vpn/tunnel/info            Get tunnel info
POST   /api/vpn/tunnel/refresh         Refresh tunnel route
GET    /api/vpn/tunnel/health          Check tunnel health
GET    /api/vpn/tunnels/active         Get all tunnels (admin)
GET    /api/vpn/tunnels/stats          Get statistics (admin)
GET    /api/vpn/servers                Get VPN servers list
```

### User Endpoints

```
GET    /api/users                      Get all users
GET    /api/users/:id                  Get user by ID
PUT    /api/users/:id                  Update user
DELETE /api/users/:id                  Delete user
GET    /api/users/search               Search users
```

### Chat Room Endpoints

```
GET    /api/chatrooms                  Get all chat rooms
POST   /api/chatrooms                  Create chat room
GET    /api/chatrooms/:id              Get chat room by ID
PUT    /api/chatrooms/:id              Update chat room
DELETE /api/chatrooms/:id              Delete chat room
POST   /api/chatrooms/:id/participants Add participant
DELETE /api/chatrooms/:id/participants Remove participant
```

### Message Endpoints

```
GET    /api/messages/:chatRoomId       Get messages
POST   /api/messages                   Send message
PUT    /api/messages/:id               Edit message
DELETE /api/messages/:id               Delete message
POST   /api/messages/:id/reaction      Add reaction
POST   /api/messages/:id/pin           Pin message
GET    /api/messages/search            Search messages
```

### Analytics Endpoints

```
GET    /api/analytics/overview         Get overview stats
GET    /api/analytics/users            Get user analytics
GET    /api/analytics/messages         Get message analytics
GET    /api/analytics/geo              Get geo distribution
```

---

## 🛡️ Security

### Authentication Security
- ✅ **JWT Tokens** - Secure session management
- ✅ **Blockchain Signatures** - Cryptographic proof
- ✅ **Password Hashing** - bcrypt with salt
- ✅ **Nonce-based Auth** - Prevent replay attacks
- ✅ **Token Expiration** - 7-day validity

### Communication Security
- ✅ **End-to-End Encryption** - AES-256
- ✅ **VPN Tunneling** - Multi-hop routing
- ✅ **Virtual IPs** - IP masking
- ✅ **Encrypted Storage** - Database encryption
- ✅ **Secure WebSockets** - WSS protocol

### Application Security
- ✅ **Rate Limiting** - Prevent abuse
- ✅ **Input Validation** - Sanitize all inputs
- ✅ **CORS Protection** - Restrict origins
- ✅ **XSS Prevention** - Content security policy
- ✅ **SQL Injection Prevention** - Mongoose ODM

### Blockchain Security
- ✅ **Smart Contract Auditing** - Secure contracts
- ✅ **Role-based Access** - On-chain permissions
- ✅ **Immutable Logs** - Tamper-proof records
- ✅ **Signature Verification** - Cryptographic proof

---

## 📂 Project Structure

```
SECCURE CHAT/
├── blockchain/                 # Blockchain smart contracts
│   ├── contracts/             # Solidity contracts
│   │   └── MilitaryAuth.sol   # Main authentication contract
│   ├── scripts/               # Deployment scripts
│   │   └── deploy.js          # Contract deployment
│   ├── test/                  # Contract tests
│   └── hardhat.config.js      # Hardhat configuration
├── server/                    # Backend
│   ├── models/                # MongoDB models
│   │   ├── User.js
│   │   ├── Message.js
│   │   ├── ChatRoom.js
│   │   └── Notification.js
│   ├── routes/                # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── chatRooms.js
│   │   ├── messages.js
│   │   ├── blockchain.js
│   │   ├── vpn.js
│   │   └── analytics.js
│   ├── middleware/            # Auth middleware
│   │   └── auth.js
│   ├── utils/                 # Utilities
│   │   ├── encryption.js
│   │   ├── blockchain.js
│   │   └── geoLocation.js
│   ├── services/              # Services
│   │   ├── blockchainService.js
│   │   └── vpnTunnelService.js
│   ├── blockchain/            # Contract ABI
│   │   └── MilitaryAuth.json
│   ├── seedData.js            # Database seeding
│   └── server.js              # Main server
├── client/                    # Frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Sidebar.js
│   │   │   ├── ChatWindow.js
│   │   │   ├── MessageItem.js
│   │   │   ├── VPNStatus.js
│   │   │   ├── NotificationPanel.js
│   │   │   ├── UserProfile.js
│   │   │   └── FileUploadModal.js
│   │   ├── pages/             # Page components
│   │   │   ├── Login.js
│   │   │   ├── BlockchainLogin.js
│   │   │   ├── Register.js
│   │   │   ├── Chat.js
│   │   │   └── Dashboard.js
│   │   ├── context/           # React Context
│   │   │   ├── AuthContext.js
│   │   │   └── SocketContext.js
│   │   ├── services/          # Services
│   │   │   └── vpnClient.js
│   │   ├── utils/             # Utilities
│   │   │   ├── api.js
│   │   │   ├── web3.js
│   │   │   └── helpers.js
│   │   ├── App.js             # Main app
│   │   └── index.css          # Global styles
│   └── public/                # Static files
├── uploads/                   # Uploaded files
├── .env                       # Environment variables
├── .env.example               # Environment template
├── package.json               # Dependencies
├── README.md                  # This file
├── BLOCKCHAIN_SETUP.md        # Blockchain setup guide
├── VPN_TUNNEL_GUIDE.md        # VPN tunnel guide
├── BLOCKCHAIN_IMPLEMENTATION.md # Implementation details
├── FEATURES_SUMMARY.md        # Features overview
└── WHAT_TO_DO_NEXT.md         # Next steps guide
```

---

## 🧪 Testing

### Run Tests

```bash
# Backend tests
npm test

# Smart contract tests
cd blockchain
npx hardhat test

# Frontend tests
cd client
npm test
```

### Manual Testing

1. **Traditional Authentication**
   - Login with demo credentials
   - Send messages
   - Upload files
   - Test all features

2. **Blockchain Authentication**
   - Connect MetaMask
   - Sign authentication message
   - Register new user
   - Test blockchain features

3. **VPN Tunneling**
   - Check VPN status widget
   - View tunnel details
   - Refresh route
   - Monitor statistics

4. **File Sharing**
   - Upload various file types
   - Test drag & drop
   - Check file preview
   - Verify encryption

---

## 🚀 Deployment

### Deploy to Production

1. **Backend Deployment** (Heroku, AWS, DigitalOcean)
   ```bash
   # Set environment variables
   # Deploy backend
   # Configure MongoDB Atlas
   ```

2. **Frontend Deployment** (Vercel, Netlify)
   ```bash
   cd client
   npm run build
   # Deploy build folder
   ```

3. **Blockchain Deployment** (Sepolia, Mainnet)
   ```bash
   cd blockchain
   npm run deploy:sepolia
   # Or for mainnet
   npm run deploy:mainnet
   ```

### Environment Variables

```env
# Server
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
ENCRYPTION_KEY=your_32_char_key

# Blockchain
BLOCKCHAIN_RPC_URL=https://...
BLOCKCHAIN_NETWORK=sepolia
BLOCKCHAIN_PRIVATE_KEY=0x...
ETHERSCAN_API_KEY=your_api_key
```

---

## 📚 Documentation

- **[BLOCKCHAIN_SETUP.md](BLOCKCHAIN_SETUP.md)** - Complete blockchain setup guide
- **[VPN_TUNNEL_GUIDE.md](VPN_TUNNEL_GUIDE.md)** - VPN tunnel technical guide
- **[BLOCKCHAIN_IMPLEMENTATION.md](BLOCKCHAIN_IMPLEMENTATION.md)** - Implementation details
- **[FEATURES_SUMMARY.md](FEATURES_SUMMARY.md)** - All features overview
- **[WHAT_TO_DO_NEXT.md](WHAT_TO_DO_NEXT.md)** - Step-by-step next steps

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenZeppelin** - Smart contract libraries
- **Hardhat** - Ethereum development environment
- **Socket.io** - Real-time communication
- **React** - UI framework
- **MongoDB** - Database
- **MetaMask** - Wallet integration

---

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check the documentation files
- Review troubleshooting sections

---

<div align="center">

**Built with ❤️ for secure military communications**

⭐ Star this repo if you find it useful!

</div>
#   S e c u r e - C h a t  
 