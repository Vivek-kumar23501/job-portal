import React, { useState } from "react";
import API from "../services/api"; // Axios instance
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const [job, setJob] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    salary: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!job.title || !job.company || !job.description || !job.location) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in as an employer to post a job.");
        return;
      }

      const res = await API.post("/jobs/create", job, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(res.data.msg || "Job posted successfully!");
      setJob({
        title: "",
        company: "",
        description: "",
        location: "",
        salary: "",
      });

      // Optional: redirect after posting
      // navigate("/employer/dashboard");
    } catch (err) {
      console.error("Job post error:", err);
      setError(
        err.response?.data?.msg || "Failed to post job. Please try again."
      );
    }
  };

  return (
    <div className="post-job-container" style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Post a New Job</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="title">Job Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={job.title}
            onChange={handleChange}
            placeholder="e.g. Frontend Developer"
            required
            style={{ width: "100%", padding: 8, marginTop: 5 }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label htmlFor="company">Company Name *</label>
          <input
            type="text"
            id="company"
            name="company"
            value={job.company}
            onChange={handleChange}
            placeholder="e.g. Infosys"
            required
            style={{ width: "100%", padding: 8, marginTop: 5 }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label htmlFor="description">Job Description *</label>
          <textarea
            id="description"
            name="description"
            value={job.description}
            onChange={handleChange}
            placeholder="Describe the job responsibilities, skills required, etc."
            rows="5"
            required
            style={{ width: "100%", padding: 8, marginTop: 5 }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={job.location}
            onChange={handleChange}
            placeholder="e.g. Delhi, India"
            required
            style={{ width: "100%", padding: 8, marginTop: 5 }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label htmlFor="salary">Salary (optional)</label>
          <input
            type="text"
            id="salary"
            name="salary"
            value={job.salary}
            onChange={handleChange}
            placeholder="e.g. ₹30,000"
            style={{ width: "100%", padding: 8, marginTop: 5 }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: 5,
          }}
        >
          Post Job
        </button>
      </form>
    </div>
  );
};

export default PostJob;
