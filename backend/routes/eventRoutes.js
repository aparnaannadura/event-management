const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEventDetails,
  registerUser,
  cancelRegistration,
  getUpcomingEvents,
  getEventStats
} = require('../controllers/eventController');
router.post('/', createEvent);
router.get('/:id', getEventDetails);
router.post('/:eventId/register', registerUser);
router.post('/:eventId/cancel', cancelRegistration);
router.get('/', getUpcomingEvents);
router.get('/:id/stats', getEventStats);
module.exports = router;
