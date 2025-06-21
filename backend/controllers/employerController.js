const Job = require('../models/Job');

// Create a new job
exports.createJob = async (req, res) => {
  try {
    const { title, description, location, salary, company, jobType, requirements } = req.body;
    const employerId = req.user.id;

    const job = new Job({
      title,
      description,
      location,
      salary,
      company,
      jobType,
      requirements,
      employer: employerId
    });

    await job.save();
    res.status(201).json({ msg: "Job created successfully", job });
  } catch (err) {
    res.status(500).json({ msg: "Failed to create job", error: err.message });
  }
};

// Get all jobs created by logged-in employer
exports.getEmployerJobs = async (req, res) => {
  try {
    const employerId = req.user.id;
    const jobs = await Job.find({ employer: employerId }).sort({ createdAt: -1 });
    res.status(200).json({ jobs }); // Wrapped in { jobs } to match frontend
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch jobs", error: err.message });
  }
};
