# Secure Military Chat - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js)

## Installation Steps

### 1. Install MongoDB

#### Windows:
1. Download MongoDB Community Server from the official website
2. Run the installer and follow the setup wizard
3. Install MongoDB as a Windows Service (recommended)
4. MongoDB will start automatically

To verify MongoDB is running:
```powershell
mongod --version
```

### 2. Install Project Dependencies

Open PowerShell in the project root directory and run:

```powershell
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Configure Environment Variables

The `.env` file is already created with default values. You can modify it if needed:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/secure-military-chat
JWT_SECRET=military_secure_chat_jwt_secret_key_2024
ENCRYPTION_KEY=32_character_encryption_key_12
NODE_ENV=development
```

### 4. Seed the Database with Dummy Data

Run the seed script to populate the database with test users and messages:

```powershell
npm run seed
```

This will create:
- **2 HQ Staff members**
- **4 Military Personnel**
- **3 Family Members**
- **6 Chat Rooms** (groups and direct messages)
- **Sample Messages** with encryption, geo-location, and VPN data

### 5. Start the Application

#### Option A: Run Both Server and Client Together (Recommended)
```powershell
npm run dev
```

#### Option B: Run Separately
In one terminal:
```powershell
npm run server
```

In another terminal:
```powershell
npm run client
```

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Demo Login Credentials

### HQ Staff (Full Access)
- **Username:** `hq.admin`
- **Password:** `admin123`
- **Features:** Dashboard, User Management, All Chat Rooms

### Military Personnel
- **Username:** `soldier.john`
- **Password:** `soldier123`
- **Features:** Group Chats, Direct Messages, File Sharing

### Family Member
- **Username:** `family.jane`
- **Password:** `family123`
- **Features:** Direct Messages with Military Personnel

## Features Overview

### 🔐 Security Features
- **End-to-End Encryption:** All messages encrypted with AES-256
- **Blockchain Authentication:** Each user has a unique blockchain address
- **VPN Tunneling:** Simulated VPN routing for all messages
- **Geo-Location Tracking:** Every message tagged with location data

### 👥 User Roles

#### HQ Staff
- View comprehensive analytics dashboard
- Monitor chat frequency and user activity
- Manage users (create, edit, delete)
- Access all chat rooms
- View geo-mapping of messages
- Monitor VPN tunnel usage

#### Military Personnel
- Create and join group chats
- Send encrypted messages
- Share files and images
- Direct messaging
- View security indicators

#### Family Members
- Direct messaging with military personnel
- Join family support groups
- Secure communication
- File sharing

### 📊 HQ Dashboard Features
- **Real-time Analytics:**
  - Active users count
  - Total messages sent
  - Chat room statistics
  - VPN tunnel usage
  
- **Visual Charts:**
  - Message activity over time (7 days)
  - Users by role distribution
  - Top active users by message frequency
  - Messages by geographic location
  - VPN tunnel routing statistics

### 💬 Chat Features
- Real-time messaging with Socket.io
- Typing indicators
- Message read receipts
- Group and direct chats
- File attachments
- Emoji support
- Message history
- Participant management

### 🗺️ Geo-Mapping
- Each message tagged with:
  - Latitude/Longitude
  - City and Country
  - Timestamp
  - VPN routing information

## Troubleshooting

### MongoDB Connection Issues
If you see "MongoDB connection error":
1. Ensure MongoDB service is running
2. Check if port 27017 is available
3. Verify MongoDB URI in `.env` file

```powershell
# Check if MongoDB is running (Windows)
Get-Service -Name MongoDB

# Start MongoDB service
Start-Service -Name MongoDB
```

### Port Already in Use
If port 5000 or 3000 is already in use:
1. Change the PORT in `.env` file
2. Update the proxy in `client/package.json`

### Dependencies Installation Failed
Try clearing npm cache and reinstalling:
```powershell
npm cache clean --force
rm -r node_modules
npm install
```

## Project Structure

```
secure-military-chat/
├── server/
│   ├── models/              # MongoDB schemas
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── ChatRoom.js
│   ├── routes/              # API endpoints
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── chatRooms.js
│   │   └── analytics.js
│   ├── middleware/          # Authentication & authorization
│   │   └── auth.js
│   ├── utils/               # Helper functions
│   │   ├── encryption.js
│   │   ├── blockchain.js
│   │   └── geoLocation.js
│   ├── server.js            # Main server file
│   └── seedData.js          # Database seeder
├── client/
│   ├── public/
│   └── src/
│       ├── components/      # React components
│       │   ├── Sidebar.js
│       │   ├── ChatWindow.js
│       │   ├── MessageItem.js
│       │   ├── Dashboard.js
│       │   ├── UserManagement.js
│       │   └── CreateChatModal.js
│       ├── pages/           # Page components
│       │   ├── Login.js
│       │   └── Chat.js
│       ├── context/         # React Context
│       │   ├── AuthContext.js
│       │   └── SocketContext.js
│       ├── utils/           # Helper functions
│       │   ├── api.js
│       │   └── helpers.js
│       ├── App.js
│       └── index.js
├── .env                     # Environment variables
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users (HQ Staff only)
- `GET /api/users/me` - Get current user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (HQ Staff only)
- `DELETE /api/users/:id` - Delete user (HQ Staff only)
- `GET /api/users/search/:query` - Search users

### Chat Rooms
- `GET /api/chatrooms` - Get user's chat rooms
- `POST /api/chatrooms` - Create new chat room
- `GET /api/chatrooms/:id` - Get chat room details
- `GET /api/chatrooms/:id/messages` - Get chat messages
- `POST /api/chatrooms/:id/participants` - Add participant
- `DELETE /api/chatrooms/:id/participants/:userId` - Remove participant

### Analytics (HQ Staff Only)
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/user-activity/:userId` - Get user activity

## Socket.io Events

### Client to Server
- `user:join` - User connects
- `message:send` - Send message
- `chatroom:join` - Join chat room
- `chatroom:leave` - Leave chat room
- `typing:start` - Start typing
- `typing:stop` - Stop typing
- `message:read` - Mark message as read

### Server to Client
- `message:receive` - Receive new message
- `user:status` - User status update
- `typing:user` - User typing indicator
- `message:read:update` - Message read status update

## Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **crypto-js** - Message encryption
- **ethers.js** - Blockchain simulation

### Frontend
- **React** - UI framework
- **React Router** - Routing
- **Socket.io-client** - Real-time client
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Leaflet** - Maps
- **Lucide React** - Icons
- **date-fns** - Date formatting

## Security Notes

⚠️ **This is a prototype for demonstration purposes.**

For production use, you should:
1. Use environment-specific secrets
2. Implement proper blockchain integration
3. Use real VPN services
4. Add rate limiting and DDoS protection
5. Implement proper file upload validation
6. Use HTTPS/WSS in production
7. Add comprehensive error handling
8. Implement proper logging and monitoring
9. Add data backup and recovery
10. Conduct security audits

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the console logs
3. Verify all dependencies are installed
4. Ensure MongoDB is running

## License

MIT License - This is a prototype application for demonstration purposes.
