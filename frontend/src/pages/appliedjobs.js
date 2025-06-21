import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './AppliedJobs.css';

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setAppliedJobs([]);
          setLoading(false);
          return;
        }

        const res = await API.get('/jobs', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userId = parseJwt(token)?.id;

        const filtered = res.data.jobs.filter((job) =>
          job.applicants?.some((applicant) => {
            const applicantId =
              typeof applicant.user === 'string'
                ? applicant.user
                : applicant.user?._id;
            return applicantId === userId;
          })
        );

        setAppliedJobs(filtered);
      } catch (error) {
        console.error('Failed to fetch applied jobs:', error);
        setAppliedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  // Decode JWT token
  function parseJwt(token) {
    try {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch (e) {
      return null;
    }
  }

  if (loading) return <p>Loading applied jobs...</p>;

  if (appliedJobs.length === 0) return <p>You haven't applied to any jobs yet.</p>;

  const userId = parseJwt(localStorage.getItem('token'))?.id;

  return (
    <div className="applied-jobs-container">
      <h2>Applied Jobs</h2>
      <ul className="applied-jobs-list">
        {appliedJobs.map((job) => {
          const applicant = job.applicants.find((app) => {
            const applicantId =
              typeof app.user === 'string' ? app.user : app.user?._id;
            return applicantId === userId;
          });

          return (
            <li key={job._id} className="applied-job-card">
              <h3>{job.title}</h3>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> {job.salary}</p>
              <p><strong>Applied On:</strong> {new Date(applicant?.appliedAt).toLocaleDateString()}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AppliedJobs;
