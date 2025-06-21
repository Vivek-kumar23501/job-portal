const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const employerRoutes = require('./routes/employerRoutes');
const userRoutes = require('./routes/userRoutes'); // Optional
const jobRoutes = require('./routes/jobRoutes');   // ✅ NEW

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Health check route
app.get('/', (req, res) => {
  res.send('🚀 Job Portal API is running...');
});

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/user', userRoutes);   // Optional
app.use('/api/jobs', jobRoutes);    // ✅ NEW

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
