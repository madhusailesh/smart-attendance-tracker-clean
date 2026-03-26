const express = require('express');
const Schedule = require('../models/Schedule');
const auth = require('../middleware/auth');
const router = express.Router();
const { processTimeTable } = require('../controllers/aiController');

router.post('/process-timetable', processTimeTable);
router.post('/save-schedule', auth, async (req, res) => {
    try {
        const { day, classes } = req.body;
        const userId = req.user.id;

        // Purana schedule delete karo taaki duplicate na ho
        await Schedule.findOneAndDelete({ user: userId, day });

        const newSchedule = new Schedule({ user: userId, day, classes });
        await newSchedule.save();
        res.json({ msg: "Saved" });
    } catch (err) {
        res.status(500).send("Save Error");
    }
});
router.get('/schedule/:day', auth, async (req, res) => {
    try {
        const schedule = await Schedule.findOne({ user: req.user.id, day: req.params.day });
        res.json(schedule);
    } catch (err) {
        res.status(500).send("Error fetching daily schedule");
    }
});
module.exports = router;