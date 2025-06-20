import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import './PostJob.css';

const PostJob = () => {
  const [job, setJob] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/employer/create-job', job);
      setMessage('Job posted successfully!');
      setTimeout(() => navigate('/employer/dashboard'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error posting job');
    }
  };

  return (
    <div className="post-job-page">
      <h2>Create Job Post</h2>
      {message && <p className="job-message">{message}</p>}
      <form onSubmit={handleSubmit} className="job-form">
        <input type="text" name="title" placeholder="Job Title" onChange={handleChange} required />
        <input type="text" name="company" placeholder="Company Name" onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
        <textarea name="description" placeholder="Job Description" rows="5" onChange={handleChange} required />
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;
