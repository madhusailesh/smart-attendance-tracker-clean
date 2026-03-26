const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { markAttendance, getStats } = require('../controllers/attendanceController');
const { markDayCancelled } = require('../controllers/attendanceController');

router.post('/mark', auth, markAttendance);
router.get('/stats', auth, getStats);
router.post('/cancel-day', auth, markDayCancelled);
module.exports = router;