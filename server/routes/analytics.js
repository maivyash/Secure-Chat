const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const ChatRoom = require('../models/ChatRoom');
const { auth, isHQStaff } = require('../middleware/auth');

// Get dashboard analytics (HQ Staff only)
router.get('/dashboard', auth, isHQStaff, async (req, res) => {
  try {
    // Total users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Total messages
    const totalMessages = await Message.countDocuments();

    // Messages by user (top 10)
    const messagesByUser = await Message.aggregate([
      {
        $group: {
          _id: '$sender',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          username: '$user.username',
          fullName: '$user.fullName',
          role: '$user.role',
          count: 1
        }
      }
    ]);

    // Messages over time (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const messagesOverTime = await Message.aggregate([
      {
        $match: {
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Active users (online)
    const activeUsers = await User.countDocuments({ status: 'online' });

    // Total chat rooms
    const totalChatRooms = await ChatRoom.countDocuments();

    // Messages by location
    const messagesByLocation = await Message.aggregate([
      {
        $match: {
          'geoLocation.country': { $ne: null }
        }
      },
      {
        $group: {
          _id: '$geoLocation.country',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // VPN tunnel usage
    const vpnTunnelUsage = await Message.aggregate([
      {
        $match: {
          'vpnTunnel.routedThrough': { $ne: null }
        }
      },
      {
        $group: {
          _id: '$vpnTunnel.routedThrough',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      usersByRole,
      totalMessages,
      messagesByUser,
      messagesOverTime,
      activeUsers,
      totalChatRooms,
      messagesByLocation,
      vpnTunnelUsage
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get user activity (HQ Staff only)
router.get('/user-activity/:userId', auth, isHQStaff, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Messages sent
    const messagesSent = await Message.countDocuments({ sender: userId });
    
    // Messages by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const messagesByDay = await Message.aggregate([
      {
        $match: {
          sender: userId,
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Chat rooms participated
    const chatRooms = await ChatRoom.countDocuments({ participants: userId });
    
    res.json({
      messagesSent,
      messagesByDay,
      chatRooms
    });
  } catch (error) {
    console.error('User activity error:', error);
    res.status(500).json({ error: 'Failed to fetch user activity' });
  }
});

module.exports = router;
