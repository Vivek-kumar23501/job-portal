const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  salary: { type: String },
  description: { type: String },
  jobType: { type: String },
  requirements: { type: String },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  applicants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      appliedAt: { type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
