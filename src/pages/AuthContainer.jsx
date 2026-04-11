import React, { useEffect, useState } from 'react';
import { FaLandmark } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './Auth.css';

const AuthContainer = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const isSignup = mode === 'signup';

  return (
    <div className="auth-shell">
      <div className={`auth-card ${isSignup ? 'signup-active' : ''}`}>
        <div className="auth-side">
          <div className="auth-side-content">
            <h2>{isSignup ? 'Welcome!' : 'Welcome Back!'}</h2>
            <p>
              {isSignup
                ? 'Create your account to save favorites, revisit virtual tours, and track your heritage quiz progress.'
                : 'Sign in to continue exploring monuments, saving favorites, and learning through the guided quiz.'}
            </p>
            <button
              type="button"
              className="panel-switch-btn"
              onClick={() => setMode(isSignup ? 'login' : 'signup')}
            >
              {isSignup ? 'SIGN IN' : 'SIGN UP'}
            </button>
          </div>
        </div>

        <div className="auth-form-panel">
          <Link to="/" className="auth-brand">
            <FaLandmark />
            <span>Indian Heritage Explorer</span>
          </Link>

          <div className="forms-slider">
            <div className={`forms-track ${isSignup ? 'slide-signup' : 'slide-login'}`}>
              <LoginForm onSwitchToSignup={() => setMode('signup')} />
              <SignupForm onSwitchToLogin={() => setMode('login')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
