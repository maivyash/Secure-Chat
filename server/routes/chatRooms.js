const express = require('express');
const router = express.Router();
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
const { auth } = require('../middleware/auth');

// Get all chat rooms for current user
router.get('/', auth, async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find({
      participants: req.user._id
    })
    .populate('participants', '-password')
    .populate('admin', '-password')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });
    
    res.json(chatRooms);
  } catch (error) {
    console.error('Get chat rooms error:', error);
    res.status(500).json({ error: 'Failed to fetch chat rooms' });
  }
});

// Create new chat room
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, participants, description } = req.body;
    
    // Add creator to participants if not already included
    const participantIds = [...new Set([...participants, req.user._id.toString()])];
    
    const chatRoom = new ChatRoom({
      name,
      type,
      participants: participantIds,
      admin: req.user._id,
      description
    });
    
    await chatRoom.save();
    await chatRoom.populate('participants', '-password');
    await chatRoom.populate('admin', '-password');
    
    res.status(201).json(chatRoom);
  } catch (error) {
    console.error('Create chat room error:', error);
    res.status(500).json({ error: 'Failed to create chat room' });
  }
});

// Get chat room by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const chatRoom = await ChatRoom.findById(req.params.id)
      .populate('participants', '-password')
      .populate('admin', '-password');
    
    if (!chatRoom) {
      return res.status(404).json({ error: 'Chat room not found' });
    }
    
    // Check if user is participant
    if (!chatRoom.participants.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(chatRoom);
  } catch (error) {
    console.error('Get chat room error:', error);
    res.status(500).json({ error: 'Failed to fetch chat room' });
  }
});

// Get messages for a chat room
router.get('/:id/messages', auth, async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;
    
    const messages = await Message.find({ chatRoom: req.params.id })
      .populate('sender', '-password')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    res.json(messages.reverse());
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Add participant to chat room
router.post('/:id/participants', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const chatRoom = await ChatRoom.findById(req.params.id);
    
    if (!chatRoom) {
      return res.status(404).json({ error: 'Chat room not found' });
    }
    
    // Check if user is admin
    if (chatRoom.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only admin can add participants' });
    }
    
    // Add participant if not already in room
    if (!chatRoom.participants.includes(userId)) {
      chatRoom.participants.push(userId);
      await chatRoom.save();
    }
    
    await chatRoom.populate('participants', '-password');
    res.json(chatRoom);
  } catch (error) {
    console.error('Add participant error:', error);
    res.status(500).json({ error: 'Failed to add participant' });
  }
});

// Remove participant from chat room
router.delete('/:id/participants/:userId', auth, async (req, res) => {
  try {
    const chatRoom = await ChatRoom.findById(req.params.id);
    
    if (!chatRoom) {
      return res.status(404).json({ error: 'Chat room not found' });
    }
    
    // Check if user is admin
    if (chatRoom.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only admin can remove participants' });
    }
    
    chatRoom.participants = chatRoom.participants.filter(
      p => p.toString() !== req.params.userId
    );
    await chatRoom.save();
    
    await chatRoom.populate('participants', '-password');
    res.json(chatRoom);
  } catch (error) {
    console.error('Remove participant error:', error);
    res.status(500).json({ error: 'Failed to remove participant' });
  }
});

module.exports = router;
