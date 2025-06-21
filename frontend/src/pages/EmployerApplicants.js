import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './EmployerApplicants.css';

const EmployerApplicants = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployerJobs();
  }, []);

  const fetchEmployerJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/jobs/employer/applications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobs(res.data.jobs);
      setLoading(false);
    } catch (err) {
      setError('Failed to load applicants');
      setLoading(false);
    }
  };

  const handleAction = async (jobId, applicantId, action) => {
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/jobs/${jobId}/applicants/${applicantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job._id === jobId
            ? {
                ...job,
                applicants: job.applicants.filter(app => app.user._id !== applicantId),
              }
            : job
        )
      );
    } catch (err) {
      alert('Failed to process action.');
    }
  };

  return (
    <div className="employer-applicants-container">
      <h2>Applicants for Your Posted Jobs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : jobs.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        jobs.map(job => (
          <div key={job._id} className="job-applicants-card">
            <h3>{job.title}</h3>
            <p><strong>Salary:</strong> {job.salary || 'Not specified'}</p>
            {job.applicants.length === 0 ? (
              <p>No applicants yet.</p>
            ) : (
              <table className="applicants-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Applied At</th>
                    <th>Job Title</th>
                    <th>Salary</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {job.applicants.map(app => (
                    <tr key={app.user._id}>
                      <td>{app.user.name}</td>
                      <td>{app.user.email}</td>
                      <td>{new Date(app.appliedAt).toLocaleString()}</td>
                      <td>{job.title}</td>
                      <td>{job.salary || 'Not specified'}</td>
                      <td>
                        <button onClick={() => handleAction(job._id, app.user._id, 'proceed')} className="proceed">Proceed</button>
                        <button onClick={() => handleAction(job._id, app.user._id, 'reject')} className="reject">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default EmployerApplicants;