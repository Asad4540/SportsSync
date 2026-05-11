const Registration = require('../models/Registration');
const Tournament = require('../models/Tournament');

/**
 * POST /api/registrations
 * Create a new team registration (Authenticated user)
 */
exports.createRegistration = async (req, res) => {
  try {
    const {
      tournament, teamName, captainName, email,
      phone, collegeName, teamMembers
    } = req.body;

    // Validation
    if (!tournament || !teamName || !captainName || !email || !phone || !collegeName) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Check if tournament exists
    const tournamentDoc = await Tournament.findById(tournament);
    if (!tournamentDoc) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Check registration deadline
    if (new Date() > new Date(tournamentDoc.registrationDeadline)) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }

    // Check max participants
    if (tournamentDoc.currentParticipants >= tournamentDoc.maxParticipants) {
      return res.status(400).json({ message: 'Tournament is full. No more registrations accepted.' });
    }

    // Check if user already registered for this tournament
    const existingRegistration = await Registration.findOne({
      tournament,
      user: req.user._id,
    });
    if (existingRegistration) {
      return res.status(400).json({ message: 'You have already registered for this tournament' });
    }

    // Parse teamMembers if it comes as a string (from form-data)
    let parsedMembers = teamMembers;
    if (typeof teamMembers === 'string') {
      try {
        parsedMembers = JSON.parse(teamMembers);
      } catch (e) {
        parsedMembers = [];
      }
    }

    // Handle file upload (payment screenshot)
    let paymentScreenshot = '';
    if (req.file) {
      paymentScreenshot = req.file.filename;
    }

    const registration = new Registration({
      tournament,
      user: req.user._id,
      teamName,
      captainName,
      email,
      phone,
      collegeName,
      teamMembers: parsedMembers || [],
      paymentScreenshot,
      status: 'pending',
    });

    await registration.save();

    // Increment participant count
    tournamentDoc.currentParticipants += 1;
    await tournamentDoc.save();

    res.status(201).json({
      message: 'Registration submitted successfully! Awaiting admin approval.',
      registration,
    });
  } catch (error) {
    console.error('Create registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/registrations/my
 * Get current user's registrations
 */
exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('tournament', 'sport venue tournamentDate status image')
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    console.error('Get my registrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/registrations
 * Get all registrations (Admin only) with search/filter
 */
exports.getAllRegistrations = async (req, res) => {
  try {
    const { status, search, tournament } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (tournament) filter.tournament = tournament;
    if (search) {
      filter.$or = [
        { teamName: { $regex: search, $options: 'i' } },
        { captainName: { $regex: search, $options: 'i' } },
        { collegeName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const registrations = await Registration.find(filter)
      .populate('tournament', 'sport venue tournamentDate')
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    console.error('Get all registrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/registrations/:id
 * Get a single registration by ID
 */
exports.getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('tournament')
      .populate('user', 'username email phone college');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Only admin or the registration owner can view
    if (req.user.role !== 'admin' && registration.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(registration);
  } catch (error) {
    console.error('Get registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/registrations/:id/status
 * Update registration status (Admin only - approve/reject)
 */
exports.updateRegistrationStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be pending, approved, or rejected.' });
    }

    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.status = status;
    if (adminRemarks !== undefined) {
      registration.adminRemarks = adminRemarks;
    }

    await registration.save();

    res.json({
      message: `Registration ${status} successfully`,
      registration,
    });
  } catch (error) {
    console.error('Update registration status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE /api/registrations/:id
 * Delete a registration (Admin only)
 */
exports.deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Decrement participant count
    const tournament = await Tournament.findById(registration.tournament);
    if (tournament && tournament.currentParticipants > 0) {
      tournament.currentParticipants -= 1;
      await tournament.save();
    }

    await Registration.findByIdAndDelete(req.params.id);

    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Delete registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
