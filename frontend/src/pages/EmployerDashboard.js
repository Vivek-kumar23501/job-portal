import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import './EmployerDashboard.css';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        const res = await API.get('/employer/jobs'); // Adjust route as per backend
        setJobs(res.data);
      } catch (error) {
        console.error('Error fetching employer jobs:', error);
      }
    };

    fetchEmployerJobs();
  }, []);

  return (
    <div className="employer-dashboard">
      <nav className="employer-navbar">
        <div className="logo">JobPortal - Employer</div>
        <ul className="nav-links">
          <li><Link to="/employer/dashboard">Dashboard</Link></li>
          <li><Link to="/employer/post-job">Post Job</Link></li>
          <li><Link to="/employer/manage-jobs">Manage Jobs</Link></li>
          <li><Link to="/employer/applicants">Applicants</Link></li>
          <li><Link to="/logout">Logout</Link></li>
        </ul>
      </nav>

      <header className="employer-hero">
        <h1>Welcome, Employer 👔</h1>
        <p>Post jobs, manage your listings, and track applicants efficiently.</p>
      </header>

      <section className="employer-actions">
        <div className="action-card">
          <h2>Post a Job</h2>
          <p>Need to hire talent? <Link to="/employer/post-job">Create a new job post</Link></p>
        </div>
        <div className="action-card">
          <h2>Manage Listings</h2>
          <p>Edit or remove jobs you've posted. <Link to="/employer/manage-jobs">Manage Jobs</Link></p>
        </div>
        <div className="action-card">
          <h2>Review Applicants</h2>
          <p>View candidates who have applied. <Link to="/employer/applicants">See Applicants</Link></p>
        </div>
      </section>

      <section className="posted-jobs">
        <h2>Your Job Listings</h2>
        {jobs.length === 0 ? (
          <p>You haven't posted any jobs yet.</p>
        ) : (
          <div className="jobs">
            {jobs.map((job) => (
              <div key={job._id} className="job-card">
                <h3>{job.title}</h3>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Description:</strong> {job.description}</p>
                <Link to={`/employer/edit-job/${job._id}`} className="edit-btn">Edit</Link>
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

export default EmployerDashboard;