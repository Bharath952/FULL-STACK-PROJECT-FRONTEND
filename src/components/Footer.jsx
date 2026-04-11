import React from 'react';
import { Link } from 'react-router-dom';
import { FaLandmark, FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <FaLandmark className="logo-icon" />
            <span>Indian Heritage Explorer</span>
          </Link>
          <p className="footer-desc text-secondary">
            Explore Indian culture with interactive monument details, guided virtual tour slides, and a heritage quiz. Frontend-only demo data.
          </p>
        </div>
        
        <div className="footer-links">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/monuments">Monuments</Link></li>
            <li><Link to="/quiz">Quiz</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </ul>
        </div>

        <div className="footer-social">
          <h4>Connect</h4>
          <div className="social-icons">
            <a href="#!"><FaTwitter /></a>
            <a href="#!"><FaFacebook /></a>
            <a href="#!"><FaLinkedin /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom text-center text-secondary">
        <p>&copy; {new Date().getFullYear()} Indian Heritage Explorer. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
