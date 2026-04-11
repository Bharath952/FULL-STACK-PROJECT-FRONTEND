import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Monuments from './pages/Monuments';
import MonumentDetails from './pages/MonumentDetails';
import Quiz from './pages/Quiz';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { getStoredUser } from './utils/authStorage';
import './index.css';
import './App.css';

const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const AuthRoute = ({ children }) => {
  const user = getStoredUser();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="app">
        <ScrollToTopOnRouteChange />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/monuments" element={<Monuments />} />
          <Route path="/monuments/:id" element={<MonumentDetails />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
