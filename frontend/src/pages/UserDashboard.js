import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import './UserDashboard.css';

const UserDashboard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get('/jobs');
        setJobs(res.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    try {
      await API.post(`/jobs/apply/${jobId}`);
      alert('Application submitted successfully');
    } catch (err) {
      alert('Error applying to job');
    }
  };

  return (
    <div className="user-dashboard">
      <nav className="user-navbar">
        <div className="logo">JobPortal </div>
        <ul className="nav-links">
          <li><Link to="/user/dashboard">Dashboard</Link></li>
          <li><Link to="/user/applied-jobs">Applied Jobs</Link></li>
          <li><Link to="/user/profile">Profile</Link></li>
          <li><Link to="/user/settings">Settings</Link></li>
          <li><Link to="/">Logout</Link></li>
        </ul>
      </nav>

      <header className="user-hero">
        <h1>Welcome, Candidate 👋</h1>
        <p>Track your applications, manage alerts, and discover new opportunities all in one place.</p>
      </header>

      <section className="dashboard-grid">
        <div className="grid-card">
          <h2>Applied Jobs</h2>
          <p>View your job application history and statuses.</p>
          <Link to="/user/applied-jobs">View Applications</Link>
        </div>
        <div className="grid-card">
          <h2>Saved Jobs</h2>
          <p>Find and apply to jobs you've saved for later.</p>
          <Link to="/user/saved-jobs">Saved Jobs</Link>
        </div>
        <div className="grid-card">
          <h2>Job Alerts</h2>
          <p>Set your preferences and get job notifications.</p>
          <Link to="/user/job-alerts">Manage Alerts</Link>
        </div>
        <div className="grid-card">
          <h2>Notifications</h2>
          <p>Stay updated on your applications and messages.</p>
          <Link to="/user/notifications">View Notifications</Link>
        </div>
        <div className="grid-card">
          <h2>Edit Profile</h2>
          <p>Update your personal details, resume, and preferences.</p>
          <Link to="/user/profile">Edit Profile</Link>
        </div>
        <div className="grid-card">
          <h2>Account Settings</h2>
          <p>Change your password, email, or delete your account.</p>
          <Link to="/user/settings">Go to Settings</Link>
        </div>
      </section>

      <section className="job-listings">
        <h2>Available Jobs</h2>
        {jobs.length === 0 ? (
          <p>No jobs available right now.</p>
        ) : (
          <div className="jobs">
            {jobs.map((job) => (
              <div key={job._id} className="job-card">
                <h3>{job.title}</h3>
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p>{job.description}</p>
                <button onClick={() => handleApply(job._id)}>Apply Now</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Job Portal. All rights reserved.</p>
        <ul className="footer-links">
          <li><Link to="/help">Help Center</Link></li>
          <li><Link to="/contact">Contact Support</Link></li>
          <li><Link to="/privacy">Privacy Policy</Link></li>
        </ul>
      </footer>
    </div>
  );
};

export default UserDashboard;