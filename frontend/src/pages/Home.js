// === src/pages/Home.js ===
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">JobPortal</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/jobs">Browse Jobs</Link></li>
          <li><Link to="/post-job">Post a Job</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/login" className="login-btn">Login</Link></li>
        </ul>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <h1>Find the Right Job for You</h1>
          <p>Thousands of opportunities from top companies around the world.</p>
          <Link to="/login" className="hero-login-btn">Get Started</Link>
        </div>
      </header>

      <section className="features">
        <h2>Why Choose JobPortal?</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Smart Search</h3>
            <p>Filter jobs by skill, location, company, or salary with ease.</p>
          </div>
          <div className="feature-card">
            <h3>Employer Tools</h3>
            <p>Post jobs, manage applicants, and track hiring progress.</p>
          </div>
          <div className="feature-card">
            <h3>Secure & Verified</h3>
            <p>We ensure genuine listings and secure communication.</p>
          </div>
        </div>
      </section>

      <section className="call-to-action">
        <h2>Ready to Take the Next Step?</h2>
        <p>Join thousands of job seekers and employers on JobPortal.</p>
        <Link to="/register" className="cta-btn">Join Now</Link>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div>
            <h4>JobPortal</h4>
            <p>Connecting talent with opportunity.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/jobs">Jobs</Link></li>
              <li><Link to="/post-job">Post a Job</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact Us</h4>
            <p>Email: support@jobportal.com</p>
            <p>Phone: +91-12345-67890</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;