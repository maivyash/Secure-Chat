const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');

// Add reaction to message
router.post('/:id/reaction', auth, async (req, res) => {
  try {
    const { emoji } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      r => r.user.toString() === req.user._id.toString() && r.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction
      message.reactions = message.reactions.filter(
        r => !(r.user.toString() === req.user._id.toString() && r.emoji === emoji)
      );
    } else {
      // Add reaction
      message.reactions.push({
        user: req.user._id,
        emoji,
        timestamp: new Date()
      });
    }

    await message.save();
    await message.populate('reactions.user', 'fullName username');

    res.json(message);
  } catch (error) {
    console.error('Reaction error:', error);
    res.status(500).json({ error: 'Failed to add reaction' });
  }
});

// Edit message
router.put('/:id', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if user is the sender
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to edit this message' });
    }

    message.content = content;
    message.edited = true;
    message.editedAt = new Date();
    await message.save();

    res.json(message);
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ error: 'Failed to edit message' });
  }
});

// Delete message
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if user is the sender or HQ staff
    if (message.sender.toString() !== req.user._id.toString() && req.user.role !== 'hq_staff') {
      return res.status(403).json({ error: 'Not authorized to delete this message' });
    }

    message.deleted = true;
    message.deletedAt = new Date();
    message.content = 'This message has been deleted';
    await message.save();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Pin message
router.post('/:id/pin', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if user is HQ staff or chat room admin
    const chatRoom = await ChatRoom.findById(message.chatRoom);
    if (req.user.role !== 'hq_staff' && chatRoom.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to pin messages' });
    }

    message.pinned = !message.pinned;
    message.pinnedBy = message.pinned ? req.user._id : null;
    await message.save();

    res.json(message);
  } catch (error) {
    console.error('Pin message error:', error);
    res.status(500).json({ error: 'Failed to pin message' });
  }
});

// Get pinned messages for a chat room
router.get('/pinned/:chatRoomId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      chatRoom: req.params.chatRoomId,
      pinned: true,
      deleted: false
    })
      .populate('sender', 'fullName username avatar')
      .populate('pinnedBy', 'fullName username')
      .sort({ timestamp: -1 });

    res.json(messages);
  } catch (error) {
    console.error('Get pinned messages error:', error);
    res.status(500).json({ error: 'Failed to fetch pinned messages' });
  }
});

// Search messages
router.get('/search', auth, async (req, res) => {
  try {
    const { query, chatRoomId, startDate, endDate } = req.query;

    const searchQuery = {
      deleted: false
    };

    if (query) {
      searchQuery.content = { $regex: query, $options: 'i' };
    }

    if (chatRoomId) {
      searchQuery.chatRoom = chatRoomId;
    }

    if (startDate || endDate) {
      searchQuery.timestamp = {};
      if (startDate) searchQuery.timestamp.$gte = new Date(startDate);
      if (endDate) searchQuery.timestamp.$lte = new Date(endDate);
    }

    const messages = await Message.find(searchQuery)
      .populate('sender', 'fullName username avatar')
      .populate('chatRoom', 'name type')
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(messages);
  } catch (error) {
    console.error('Search messages error:', error);
    res.status(500).json({ error: 'Failed to search messages' });
  }
});

// Get message thread (replies)
router.get('/:id/thread', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      replyTo: req.params.id,
      deleted: false
    })
      .populate('sender', 'fullName username avatar')
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Get thread error:', error);
    res.status(500).json({ error: 'Failed to fetch thread' });
  }
});

// Forward message
router.post('/:id/forward', auth, async (req, res) => {
  try {
    const { chatRoomIds } = req.body;
    const originalMessage = await Message.findById(req.params.id);

    if (!originalMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const forwardedMessages = [];

    for (const chatRoomId of chatRoomIds) {
      const newMessage = new Message({
        sender: req.user._id,
        content: `[Forwarded] ${originalMessage.content}`,
        encryptedContent: originalMessage.encryptedContent,
        chatRoom: chatRoomId,
        messageType: originalMessage.messageType,
        fileUrl: originalMessage.fileUrl,
        fileName: originalMessage.fileName,
        geoLocation: originalMessage.geoLocation,
        vpnTunnel: originalMessage.vpnTunnel
      });

      await newMessage.save();
      forwardedMessages.push(newMessage);
    }

    res.json({
      message: 'Message forwarded successfully',
      forwardedMessages
    });
  } catch (error) {
    console.error('Forward message error:', error);
    res.status(500).json({ error: 'Failed to forward message' });
  }
});

module.exports = router;
