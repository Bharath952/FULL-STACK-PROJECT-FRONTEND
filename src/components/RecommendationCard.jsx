import React from 'react';
import './RecommendationCard.css';
import { FaUtensils, FaPaintRoller, FaMicrochip, FaBath, FaHome } from 'react-icons/fa';

const RecommendationCard = ({ recommendation }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'kitchen': return <FaUtensils />;
      case 'paint': return <FaPaintRoller />;
      case 'tech': return <FaMicrochip />;
      case 'bath': return <FaBath />;
      default: return <FaHome />;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'primary';
      case 'low': return 'secondary';
      default: return 'primary';
    }
  };

  const priorityClass = getPriorityClass(recommendation.priority);

  return (
    <div className="rec-card shadow-card fade-in">
      <div className="rec-icon-wrapper">
        <div className={`rec-icon ${priorityClass}`}>
          {getIcon(recommendation.iconType)}
        </div>
        <span className={`priority-badge badge-${priorityClass}`}>
          {recommendation.priority} Priority
        </span>
      </div>
      <div className="rec-content">
        <h3 className="rec-title">{recommendation.title}</h3>
        <p className="rec-desc text-secondary">{recommendation.description}</p>
        
        <div className="rec-stats">
          <div className="stat-box cost">
            <span className="stat-label">Est. Cost</span>
            <span className="stat-val">{recommendation.costEstimate}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">ROI %</span>
            <span className="stat-val growth-val">+{recommendation.valueIncreasePct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
