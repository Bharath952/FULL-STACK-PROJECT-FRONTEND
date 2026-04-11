import React from 'react';
import { FaPaintBrush, FaChartLine, FaCalculator, FaShieldAlt } from 'react-icons/fa';

const FeatureCard = ({ icon, title, delay }) => {
  const getIcon = () => {
    switch(icon) {
      case 'support': return <FaCalculator />;
      case 'roi': return <FaChartLine />;
      case 'secure': return <FaShieldAlt />;
      case 'insights': return <FaPaintBrush />;
      default: return <FaChartLine />;
    }
  };

  return (
    <div 
      className="glass-card flex items-center gap-1 fade-in" 
      style={{ padding: '0.8rem 1.2rem', animationDelay: delay || '0s', width: 'fit-content' }}
    >
      <div style={{ color: '#6366f1', fontSize: '1.2rem' }}>
        {getIcon()}
      </div>
      <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#0f172a' }}>{title}</span>
    </div>
  );
};

export default FeatureCard;
