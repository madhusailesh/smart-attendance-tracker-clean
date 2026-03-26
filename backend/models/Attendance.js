const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true },
  subject: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Present', 'Absent', 'Cancelled', 'Extra'], 
    default: 'Present' 
  },
  isManual: { type: Boolean, default: false } // Agar user ne khud change kiya ho
});

module.exports = mongoose.model('Attendance', attendanceSchema);