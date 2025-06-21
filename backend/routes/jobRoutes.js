const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const { authenticate, checkRole } = require('../middleware/authMiddleware');

// ✅ GET: Fetch all jobs (public)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).populate('applicants.user', 'email role');
    res.status(200).json({ jobs });
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ msg: 'Failed to fetch jobs' });
  }
});

// ✅ POST: Create a job (only for employers)
router.post('/create', authenticate, checkRole('employer'), async (req, res) => {
  try {
    const { title, company, description, location, salary } = req.body;

    if (!title || !company || !description || !location) {
      return res.status(400).json({ msg: 'Please fill all required fields' });
    }

    const newJob = new Job({
      title,
      company,
      description,
      location,
      salary,
      employer: req.user.id
    });

    await newJob.save();

    res.status(201).json({ msg: 'Job posted successfully!', job: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ msg: 'Failed to create job', error: error.message });
  }
});

// ✅ POST: Apply to a job (only for users)
router.post('/apply/:jobId', authenticate, checkRole('user'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    const alreadyApplied = job.applicants.some(applicant =>
      applicant.user && applicant.user.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({ msg: 'You have already applied for this job.' });
    }

    job.applicants.push({ user: req.user.id, appliedAt: new Date() });
    await job.save();

    res.status(200).json({ msg: 'Application submitted successfully' });
  } catch (err) {
    console.error('Error in /apply route:', err);
    res.status(500).json({ msg: 'Failed to apply to job', error: err.message });
  }
});

// ✅ GET: All jobs posted by the employer with applicant details
router.get('/employer/applications', authenticate, checkRole('employer'), async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id })
      .populate('applicants.user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ jobs });
  } catch (err) {
    console.error('Error fetching employer jobs with applicants:', err);
    res.status(500).json({ msg: 'Failed to fetch applicants' });
  }
});

// ✅ DELETE: Remove an applicant from a job (when employer proceeds or rejects)
router.delete('/:jobId/applicants/:applicantId', authenticate, checkRole('employer'), async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, employer: req.user.id });
    if (!job) return res.status(404).json({ msg: 'Job not found or unauthorized' });

    job.applicants = job.applicants.filter(
      (app) => app.user.toString() !== req.params.applicantId
    );

    await job.save();
    res.status(200).json({ msg: 'Applicant removed successfully' });
  } catch (err) {
    console.error('Error removing applicant:', err);
    res.status(500).json({ msg: 'Failed to remove applicant' });
  }
});

module.exports = router;
