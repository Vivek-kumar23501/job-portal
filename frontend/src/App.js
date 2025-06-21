import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostJob from './pages/Postjob';
import AppliedJobs from './pages/appliedjobs';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import UserDashboard from './pages/UserDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import EmployerApplicants from './pages/EmployerApplicants';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/user/applied-jobs" element={<AppliedJobs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/employer/applicants" element={<EmployerApplicants />} />
        <Route path="/employer/post-job" element={<PostJob />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
