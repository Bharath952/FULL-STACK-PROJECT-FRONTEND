import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaFacebookF, FaGoogle, FaLinkedinIn } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { getApiErrorMessage } from '../utils/apiError';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginForm = ({ onSwitchToSignup }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setForgotMsg('');

    if (!EMAIL_REGEX.test(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!formData.password || formData.password.length < 4) {
      setErrorMsg('Password must be at least 4 characters for this demo.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password
      };
      const { data: found } = await API.post('/api/auth/login', payload);

      const userToStore = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role || 'USER'
      };

      // Persist session based on rememberMe.
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      if (rememberMe) localStorage.setItem('user', JSON.stringify(userToStore));
      else sessionStorage.setItem('user', JSON.stringify(userToStore));

      navigate('/dashboard');
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error) || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <h3>Sign In</h3>
      <div className="social-row">
        <button type="button" className="social-btn" aria-label="Sign in with Google">
          <FaGoogle />
        </button>
        <button type="button" className="social-btn" aria-label="Sign in with Facebook">
          <FaFacebookF />
        </button>
        <button type="button" className="social-btn" aria-label="Sign in with LinkedIn">
          <FaLinkedinIn />
        </button>
      </div>
      <p className="divider-text">or use your account</p>

      {errorMsg ? <p className="form-error">{errorMsg}</p> : null}
      {forgotMsg ? <p className="form-success">{forgotMsg}</p> : null}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="field password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="meta-row">
          <label className="remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <button
            type="button"
            className="link-btn"
            onClick={() =>
              setForgotMsg('Password reset UI placeholder. Connect this to backend when ready.')
            }
          >
            Forgot password?
          </button>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Signing in...' : 'SIGN IN'}
        </button>
      </form>

      <p className="switch-line">
        New here?{' '}
        <button type="button" className="inline-switch" onClick={onSwitchToSignup}>
          Create Account
        </button>
      </p>
    </section>
  );
};

export default LoginForm;
