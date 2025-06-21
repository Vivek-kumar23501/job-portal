const express = require('express');
const router = express.Router();
const { authenticate, checkRole } = require('../middleware/authMiddleware');
const { createJob, getEmployerJobs } = require('../controllers/employerController');

// Route to create a job (employer only)
router.post('/create-job', authenticate, checkRole('employer'), createJob);

// Route to fetch jobs created by employer
router.get('/jobs', authenticate, checkRole('employer'), getEmployerJobs);

module.exports = router;
