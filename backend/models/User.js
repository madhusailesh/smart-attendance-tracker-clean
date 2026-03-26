const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // the detail of semister which set by user after login 
  semesterStart: { type: Date },
  semesterEnd: { type: Date },
  attendanceThreshold: { type: Number, default: 75 }, // Default 75%
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
