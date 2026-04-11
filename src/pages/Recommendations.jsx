import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RecommendationCard from '../components/RecommendationCard';
import { mockRecommendations } from '../data/mockData';
import { FaFilter } from 'react-icons/fa';

const Recommendations = () => {
  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar isAdmin={false} />
        <main className="dashboard-content fade-in">
          <div className="dashboard-header flex justify-between items-center bg-white shadow-sm p-4 rounded-md">
            <div>
              <h2>AI-Powered Recommendations</h2>
              <p className="text-secondary">
                Tailored improvement ideas with title, ROI %, estimated cost, and priority
              </p>
            </div>
            <div className="header-actions flex gap-1 flex-wrap">
              <Link to="/saved-properties" className="btn btn-secondary">
                View Saved Properties
              </Link>
              <button type="button" className="btn btn-secondary">
                <FaFilter /> Filter Ideas
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {mockRecommendations.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Recommendations;
