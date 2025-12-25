import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to CompanyGrow</h1>
        <p>Empower your professional growth with our comprehensive learning and project management platform</p>
        <button className="get-started-btn" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
