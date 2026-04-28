import React, { useMemo, useState } from 'react';
import { FaEye, FaEyeSlash, FaFacebookF, FaGoogle, FaLinkedinIn } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { getApiErrorMessage, isDuplicateEmailMessage } from '../utils/apiError';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getPasswordStrength = (password) => {
  if (!password) return { label: '', className: 'none' };
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^a-zA-Z0-9]/.test(password);

  if (password.length >= 10 && hasLetters && hasNumbers && hasSymbols) {
    return { label: 'Strong', className: 'strong' };
  }
  if (password.length >= 7 && hasLetters && hasNumbers) {
    return { label: 'Medium', className: 'medium' };
  }
  return { label: 'Weak', className: 'weak' };
};

const SignupForm = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setEmailError('');

    if (!EMAIL_REGEX.test(formData.email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    if (!formData.name || formData.name.trim().length < 2) {
      setErrorMsg('Please enter your name (at least 2 characters).');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters for this demo.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role
      };
      const { data: savedUser } = await API.post('/api/auth/signup', payload);
      const userToStore = {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role || 'USER'
      };

      localStorage.setItem('user', JSON.stringify(userToStore));
      sessionStorage.removeItem('user');
      navigate('/dashboard');
    } catch (error) {
      const message = getApiErrorMessage(error);
      if (isDuplicateEmailMessage(message)) {
        setEmailError(message);
        return;
      }
      setErrorMsg(message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <h3>Create Account</h3>
      <div className="social-row">
        <button type="button" className="social-btn" aria-label="Sign up with Google">
          <FaGoogle />
        </button>
        <button type="button" className="social-btn" aria-label="Sign up with Facebook">
          <FaFacebookF />
        </button>
        <button type="button" className="social-btn" aria-label="Sign up with LinkedIn">
          <FaLinkedinIn />
        </button>
      </div>
      <p className="divider-text">or use your account</p>
      {errorMsg ? <p className="form-error form-error-banner">{errorMsg}</p> : null}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
        </div>
        <div className="field">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            aria-invalid={emailError ? 'true' : 'false'}
            aria-describedby={emailError ? 'signup-email-error' : undefined}
            className={emailError ? 'input-error' : undefined}
          />
          {emailError ? (
            <p id="signup-email-error" className="field-error" role="alert">
              {emailError}
            </p>
          ) : null}
        </div>
        <div className="field">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="role-select"
            required
          >
            <option value="USER">I am a User</option>
            <option value="CREATOR">I am a Creator</option>
            <option value="ADMIN">I am an Admin</option>
          </select>
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

        {strength.label ? (
          <div className="strength-wrap">
            <div className="strength-track">
              <div className={`strength-fill ${strength.className}`} />
            </div>
            <span className={`strength-text ${strength.className}`}>{strength.label}</span>
          </div>
        ) : null}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating account...' : 'SIGN UP'}
        </button>
      </form>

      <p className="switch-line">
        Already have an account?{' '}
        <button type="button" className="inline-switch" onClick={onSwitchToLogin}>
          Sign In
        </button>
      </p>
    </section>
  );
};

export default SignupForm;
