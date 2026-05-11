const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/', tournamentController.getAllTournaments);
router.get('/:id', tournamentController.getTournamentById);

// Admin routes (require authentication + admin role)
router.post('/', authMiddleware, adminMiddleware, tournamentController.createTournament);
router.put('/:id', authMiddleware, adminMiddleware, tournamentController.updateTournament);
router.delete('/:id', authMiddleware, adminMiddleware, tournamentController.deleteTournament);

module.exports = router;
