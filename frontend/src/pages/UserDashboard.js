import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import './UserDashboard.css';

const UserDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get('/jobs');
      if (Array.isArray(res.data.jobs)) {
        setJobs(res.data.jobs);

        const token = localStorage.getItem('token');
        if (token) {
          const decoded = parseJwt(token);
          const userId = decoded?.id;

          const applied = res.data.jobs
            .filter(job => job.applicants?.some(app => app.user?._id === userId))
            .map(job => job._id);

          setAppliedJobIds(applied);
        }
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleApply = async (jobId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to apply');
      return;
    }

    const decoded = parseJwt(token);
    if (!decoded || decoded.role !== 'user') {
      alert('Access denied. Only users can apply to jobs.');
      return;
    }

    try {
      const res = await API.post(`/jobs/apply/${jobId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        alert('Application submitted successfully');
        setAppliedJobIds(prev => [...prev, jobId]);
      }
    } catch (err) {
      console.error('Error applying to job:', err);
      const msg = err?.response?.data?.msg || 'Error applying to job';
      alert(msg);
    }
  };

  const parseJwt = (token) => {
    try {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="user-dashboard">
      <nav className="user-navbar">
        <div className="logo">JobPortal</div>
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
                <p><strong>Salary:</strong> {job.salary}</p>
                <p>{job.description}</p>
                <button
                  onClick={() => handleApply(job._id)}
                  disabled={appliedJobIds.includes(job._id)}
                >
                  {appliedJobIds.includes(job._id) ? 'Already Applied' : 'Apply Now'}
                </button>
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