# Secure Military Chat Application

A MERN stack secure chat application with military theme, featuring encrypted messaging, geo-mapping, VPN tunneling simulation, and blockchain-based authentication.

## Features

### User Roles
1. **HQ Staff**
   - Manage users (create, edit, delete)
   - Smart dashboard with chat frequency analytics
   - Monitor all communications
   - View geo-mapping of messages

2. **Military Personnel**
   - Group chat functionality
   - File sharing (documents, images)
   - Encrypted messaging
   - Location tracking

3. **Family Members**
   - Chat with military personnel
   - Secure messaging
   - File sharing

### Security Features
- End-to-end message encryption (AES-256)
- Blockchain-based authentication
- VPN tunneling simulation
- Geo-location tracking for each message
- JWT token authentication

## Installation

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Setup

1. Install all dependencies:
```bash
npm run install-all
```

2. Start MongoDB service

3. Seed dummy data:
```bash
npm run seed
```

4. Run the application:
```bash
npm run dev
```

The server will run on `http://localhost:5000` and the client on `http://localhost:3000`

## Default Users (Dummy Data)

### HQ Staff
- Username: `hq.admin`
- Password: `admin123`

### Military Personnel
- Username: `soldier.john`
- Password: `soldier123`

- Username: `captain.smith`
- Password: `captain123`

### Family Members
- Username: `family.jane`
- Password: `family123`

## Technology Stack

### Backend
- Express.js
- MongoDB with Mongoose
- Socket.io (real-time messaging)
- JWT authentication
- Crypto-js (encryption)
- Ethers.js (blockchain simulation)

### Frontend
- React.js
- Socket.io-client
- Recharts (analytics)
- Leaflet (geo-mapping)
- Tailwind CSS (styling)
- Lucide React (icons)

## Project Structure

```
secure-military-chat/
├── server/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & encryption middleware
│   ├── utils/           # Utility functions
│   ├── server.js        # Main server file
│   └── seedData.js      # Dummy data seeder
├── client/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Context API
│   │   ├── utils/       # Utility functions
│   │   └── App.js       # Main app component
│   └── package.json
└── package.json
```

## License
MIT
