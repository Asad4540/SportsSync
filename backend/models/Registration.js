const mongoose = require('mongoose');

/**
 * Registration Schema
 * Stores team registration details for a tournament
 */
const registrationSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: [true, 'Tournament reference is required'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
  },
  teamName: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
  },
  captainName: {
    type: String,
    required: [true, 'Captain name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  collegeName: {
    type: String,
    required: [true, 'College name is required'],
    trim: true,
  },
  teamMembers: [{
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      default: 'Player',
    },
  }],
  paymentScreenshot: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  adminRemarks: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);
