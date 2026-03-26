const express = require('express');
const router = express.Router();
const { processTimeTable } = require('../controllers/aiController');

router.post('/process-timetable', processTimeTable);

module.exports = router;