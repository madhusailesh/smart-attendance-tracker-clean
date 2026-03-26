const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  day: { type: String, required: true }, // e.g., "Monday"
  classes: [{
    subject: String,
    startTime: String, // e.g., "10:00 AM"
    endTime: String
  }]
});

module.exports = mongoose.model('Schedule', scheduleSchema);