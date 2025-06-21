// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate, checkRole } = require('../middleware/authMiddleware');
const Job = require('../models/Job'); // Import your Job model

// ✅ Get all available jobs (visible to users)
router.get('/jobs', authenticate, checkRole('user'), async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch jobs', error: err.message });
  }
});

module.exports = router;
