const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const chatRoomRoutes = require('./routes/chatRooms');
const analyticsRoutes = require('./routes/analytics');
const messageRoutes = require('./routes/messages');
const uploadRoutes = require('./routes/upload');
const notificationRoutes = require('./routes/notifications');
const blockchainRoutes = require('./routes/blockchain');
const vpnRoutes = require('./routes/vpn');

// Import services
const blockchainService = require('./services/blockchainService');
const vpnTunnelService = require('./services/vpnTunnelService');

// Import models
const Message = require('./models/Message');
const ChatRoom = require('./models/ChatRoom');
const User = require('./models/User');

// Import utilities
const { encryptMessage, decryptMessage } = require('./utils/encryption');
const { generateVPNTunnelId, getVPNRoute } = require('./utils/blockchain');
const { getGeoLocation } = require('./utils/geoLocation');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chatrooms', chatRoomRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/vpn', vpnRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Secure Military Chat API is running' });
});

// Socket.io connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // User joins
  socket.on('user:join', async (userId) => {
    try {
      connectedUsers.set(userId, socket.id);
      socket.userId = userId;
      
      // Create VPN tunnel for user
      const tunnel = vpnTunnelService.createTunnel(userId, socket.id);
      socket.tunnelId = tunnel.tunnelId;
      
      // Update user status
      await User.findByIdAndUpdate(userId, { status: 'online', lastSeen: new Date() });
      
      // Get user's chat rooms
      const chatRooms = await ChatRoom.find({ participants: userId });
      chatRooms.forEach(room => {
        socket.join(room._id.toString());
      });
      
      // Notify others
      io.emit('user:status', { userId, status: 'online' });
      
      // Send tunnel info to client
      socket.emit('vpn:tunnel:created', {
        tunnelId: tunnel.tunnelId,
        virtualIP: tunnel.virtualIP,
        route: tunnel.route.map(r => ({
          name: r.name,
          location: r.location,
          hopNumber: r.hopNumber
        })),
        status: 'connected'
      });
      
      console.log(`User ${userId} joined with VPN tunnel ${tunnel.tunnelId}`);
    } catch (error) {
      console.error('User join error:', error);
    }
  });

  // Send message
  socket.on('message:send', async (data) => {
    try {
      const { chatRoomId, content, senderId, messageType, fileUrl, fileName } = data;
      
      // Get sender's VPN tunnel
      const tunnel = vpnTunnelService.getTunnelBySocket(socket.id);
      
      // Route message through VPN tunnel
      let vpnTunnel;
      let routingInfo;
      
      if (tunnel) {
        const routedMessage = await vpnTunnelService.routeMessage(senderId, {
          content,
          chatRoomId,
          messageType,
          timestamp: Date.now()
        });
        
        vpnTunnel = {
          tunnelId: routedMessage.tunnelId,
          encryptionLevel: 'AES-256-GCM Multi-Layer',
          routedThrough: routedMessage.route.map(r => r.name).join(' → '),
          virtualIP: routedMessage.virtualIP,
          totalLatency: routedMessage.totalLatency
        };
        
        routingInfo = routedMessage.routingInfo;
      } else {
        // Fallback if no tunnel
        vpnTunnel = {
          tunnelId: generateVPNTunnelId(),
          encryptionLevel: 'AES-256',
          routedThrough: getVPNRoute()
        };
      }
      
      // Encrypt message
      const encryptedContent = encryptMessage(content);
      
      // Get geo-location
      const geoLocation = getGeoLocation();
      
      // Create message
      const message = new Message({
        sender: senderId,
        content,
        encryptedContent,
        chatRoom: chatRoomId,
        messageType: messageType || 'text',
        fileUrl,
        fileName,
        geoLocation,
        vpnTunnel
      });
      
      await message.save();
      await message.populate('sender', '-password');
      
      // Update chat room
      await ChatRoom.findByIdAndUpdate(chatRoomId, {
        lastMessage: message._id,
        updatedAt: new Date()
      });
      
      // Emit to chat room with routing info
      io.to(chatRoomId).emit('message:receive', {
        ...message.toObject(),
        routingInfo
      });
      
      console.log(`Message sent through VPN tunnel ${vpnTunnel.tunnelId} in room ${chatRoomId}`);
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('message:error', { error: 'Failed to send message' });
    }
  });

  // Join chat room
  socket.on('chatroom:join', (chatRoomId) => {
    socket.join(chatRoomId);
    console.log(`Socket ${socket.id} joined room ${chatRoomId}`);
  });

  // Leave chat room
  socket.on('chatroom:leave', (chatRoomId) => {
    socket.leave(chatRoomId);
    console.log(`Socket ${socket.id} left room ${chatRoomId}`);
  });

  // Typing indicator
  socket.on('typing:start', (data) => {
    socket.to(data.chatRoomId).emit('typing:user', {
      userId: data.userId,
      username: data.username,
      isTyping: true
    });
  });

  socket.on('typing:stop', (data) => {
    socket.to(data.chatRoomId).emit('typing:user', {
      userId: data.userId,
      username: data.username,
      isTyping: false
    });
  });

  // Mark message as read
  socket.on('message:read', async (data) => {
    try {
      const { messageId, userId } = data;
      const message = await Message.findById(messageId);
      
      if (message && !message.readBy.some(r => r.user.toString() === userId)) {
        message.readBy.push({ user: userId, readAt: new Date() });
        await message.save();
        
        io.to(message.chatRoom.toString()).emit('message:read:update', {
          messageId,
          userId
        });
      }
    } catch (error) {
      console.error('Mark read error:', error);
    }
  });

  // Message reaction
  socket.on('message:reaction', async (data) => {
    try {
      const { messageId, emoji, userId } = data;
      const message = await Message.findById(messageId);
      
      if (message) {
        const existingReaction = message.reactions.find(
          r => r.user.toString() === userId && r.emoji === emoji
        );

        if (existingReaction) {
          message.reactions = message.reactions.filter(
            r => !(r.user.toString() === userId && r.emoji === emoji)
          );
        } else {
          message.reactions.push({ user: userId, emoji, timestamp: new Date() });
        }

        await message.save();
        
        io.to(message.chatRoom.toString()).emit('message:reaction:update', {
          messageId,
          reactions: message.reactions
        });
      }
    } catch (error) {
      console.error('Reaction error:', error);
    }
  });

  // Send notification
  socket.on('notification:send', async (data) => {
    try {
      const { recipientId, type, title, content, link } = data;
      const recipientSocket = connectedUsers.get(recipientId);
      
      if (recipientSocket) {
        io.to(recipientSocket).emit('notification:receive', {
          type,
          title,
          content,
          link,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Notification error:', error);
    }
  });

  // Disconnect
  socket.on('disconnect', async () => {
    try {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        
        // Close VPN tunnel
        vpnTunnelService.closeTunnel(socket.userId);
        
        // Update user status
        await User.findByIdAndUpdate(socket.userId, {
          status: 'offline',
          lastSeen: new Date()
        });
        
        // Notify others
        io.emit('user:status', { userId: socket.userId, status: 'offline' });
        
        console.log(`User ${socket.userId} disconnected and VPN tunnel closed`);
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  });
});

// Connect to MongoDB and initialize blockchain
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Initialize blockchain service
    console.log('🔗 Initializing blockchain service...');
    await blockchainService.initialize();
    
    // Start server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Blockchain: ${blockchainService.isInitialized ? 'Connected' : 'Simulation Mode'}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

module.exports = { app, server, io };
