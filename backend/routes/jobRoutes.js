const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');

// ✅ GET: Fetch all jobs (public for users)
// Get all jobs (public)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({ jobs }); // ✅ Wrap inside { jobs }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch jobs' });
  }
});
const { authenticate, checkRole } = require('../middleware/authMiddleware');

router.post('/apply/:jobId', authenticate, checkRole('user'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    const alreadyApplied = job.applicants.some(app => app.user.toString() === req.user.id);
    if (alreadyApplied) return res.status(400).json({ msg: 'You have already applied for this job.' });

    job.applicants.push({ user: req.user.id });
    await job.save();

    res.status(200).json({ msg: 'Application submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to apply to job', error: err.message });
  }
});



// ✅ POST: Create a job (employer only)
router.post('/create-job', async (req, res) => {
  try {
    const { title, company, location, description, employerId } = req.body;

    const employer = await User.findById(employerId);
    if (!employer || employer.role !== 'employer') {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const newJob = new Job({
      title,
      company,
      location,
      description,
      createdBy: employerId,
    });

    await newJob.save();
    res.status(201).json({ msg: 'Job posted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error while creating job' });
  }
});

module.exports = router;
