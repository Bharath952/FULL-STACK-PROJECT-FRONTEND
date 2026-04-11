import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaLandmark, FaMoon, FaSun } from 'react-icons/fa';
import { getStoredUser } from '../utils/authStorage';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getStoredUser());

  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('heritage_theme');
    return stored || 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('heritage_theme', theme);
  }, [theme]);

  const isDark = theme === 'dark';

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const tailItem = useMemo(() => {
    if (user) return { to: '/dashboard', label: 'Dashboard' };
    return { to: '/login', label: 'Login' };
  }, [user]);

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo" aria-label="Indian Heritage Explorer home">
          <FaLandmark className="logo-icon" />
          <span>Indian Heritage Explorer</span>
        </Link>
        <ul className="navbar-menu">
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/monuments" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Monuments
            </NavLink>
          </li>
          <li>
            <NavLink to="/quiz" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Quiz
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to={tailItem.to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {tailItem.label}
            </NavLink>
          </li>
        </ul>
        <div className="navbar-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <FaSun /> : <FaMoon />}
          </button>

          {user ? (
            <button onClick={handleLogout} className="btn btn-gradient" style={{ padding: '0.6rem 1.1rem' }}>
              Logout
            </button>
          ) : (
            <Link to="/signup" className="btn btn-light" style={{ padding: '0.6rem 1.1rem', fontWeight: '700' }}>
              Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
