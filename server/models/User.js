const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['hq_staff', 'military_personnel', 'family_member'],
    required: true
  },
  rank: {
    type: String,
    default: null
  },
  unit: {
    type: String,
    default: null
  },
  blockchainAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  blockchainRegistered: {
    type: Boolean,
    default: false
  },
  lastBlockchainSync: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'away'],
    default: 'offline'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { 
      _id: this._id,
      username: this.username,
      role: this.role,
      blockchainAddress: this.blockchainAddress
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  return token;
};

module.exports = mongoose.model('User', userSchema);
