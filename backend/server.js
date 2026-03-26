const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log("DB Error:", err));

// Test Route
app.get('/', (req, res) => {
  res.send("ots woking");
});
// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes')); // Profile update 
app.use('/api/ai', require('./routes/aiRoutes')); // Groq AI ke liye
app.use('/api/attendance', require('./routes/attendanceRoutes')); // Mark/Stats ke liye
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));