const mongoose = require('mongoose');

/**
 * Tournament Schema
 * Represents a sport tournament with details like venue, fees, dates
 */
const tournamentSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: [true, 'Sport name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  rules: {
    type: String,
    default: '',
  },
  venue: {
    type: String,
    required: [true, 'Venue name is required'],
    trim: true,
  },
  venueAddress: {
    type: String,
    default: '',
  },
  venueCoordinates: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
  },
  teamSize: {
    type: Number,
    required: [true, 'Team size is required'],
    min: [1, 'Team size must be at least 1'],
  },
  registrationFees: {
    type: Number,
    required: [true, 'Registration fees is required'],
    min: [0, 'Fees cannot be negative'],
  },
  tournamentDate: {
    type: Date,
    required: [true, 'Tournament date is required'],
  },
  registrationDeadline: {
    type: Date,
    required: [true, 'Registration deadline is required'],
  },
  maxParticipants: {
    type: Number,
    required: [true, 'Max participants is required'],
    min: [2, 'Must allow at least 2 participants'],
  },
  currentParticipants: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Tournament', tournamentSchema);
