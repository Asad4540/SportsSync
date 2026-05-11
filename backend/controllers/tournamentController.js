const Tournament = require('../models/Tournament');

/**
 * GET /api/tournaments
 * Get all tournaments (public) with optional filters
 */
exports.getAllTournaments = async (req, res) => {
  try {
    const { sport, status, search } = req.query;
    let filter = {};

    if (sport) filter.sport = { $regex: sport, $options: 'i' };
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { sport: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tournaments = await Tournament.find(filter)
      .populate('createdBy', 'username')
      .sort({ tournamentDate: 1 });

    res.json(tournaments);
  } catch (error) {
    console.error('Get tournaments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/tournaments/:id
 * Get a single tournament by ID (public)
 */
exports.getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('createdBy', 'username');

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    res.json(tournament);
  } catch (error) {
    console.error('Get tournament error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/tournaments
 * Create a new tournament (Admin only)
 */
exports.createTournament = async (req, res) => {
  try {
    const {
      sport, description, rules, venue, venueAddress,
      venueCoordinates, teamSize, registrationFees,
      tournamentDate, registrationDeadline, maxParticipants,
      image, status
    } = req.body;

    // Validation
    if (!sport || !description || !venue || !teamSize || registrationFees === undefined || !tournamentDate || !registrationDeadline || !maxParticipants) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const tournament = new Tournament({
      sport,
      description,
      rules: rules || '',
      venue,
      venueAddress: venueAddress || '',
      venueCoordinates: venueCoordinates || { lat: 0, lng: 0 },
      teamSize,
      registrationFees,
      tournamentDate,
      registrationDeadline,
      maxParticipants,
      image: image || '',
      status: status || 'upcoming',
      createdBy: req.user._id,
    });

    await tournament.save();

    res.status(201).json({
      message: 'Tournament created successfully',
      tournament,
    });
  } catch (error) {
    console.error('Create tournament error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/tournaments/:id
 * Update a tournament (Admin only)
 */
exports.updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Update all provided fields
    const allowedFields = [
      'sport', 'description', 'rules', 'venue', 'venueAddress',
      'venueCoordinates', 'teamSize', 'registrationFees',
      'tournamentDate', 'registrationDeadline', 'maxParticipants',
      'image', 'status'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        tournament[field] = req.body[field];
      }
    });

    await tournament.save();

    res.json({
      message: 'Tournament updated successfully',
      tournament,
    });
  } catch (error) {
    console.error('Update tournament error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE /api/tournaments/:id
 * Delete a tournament (Admin only)
 */
exports.deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    await Tournament.findByIdAndDelete(req.params.id);

    res.json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    console.error('Delete tournament error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
