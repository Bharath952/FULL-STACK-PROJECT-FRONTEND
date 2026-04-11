import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PropertyCard from '../components/PropertyCard';
import { mockStats } from '../data/mockData';
import { Link } from 'react-router-dom';
import { FaPlus, FaLightbulb, FaBookmark, FaStar } from 'react-icons/fa';
import API from '../services/api';
import { getStoredUser } from '../utils/authStorage';
import './Dashboard.css';

const UserDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getStoredUser();
    if (!user?.id) {
      setProperties([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await API.get(`/properties/user/${user.id}`);
        if (!cancelled) {
          setProperties(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) setProperties([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const total = properties.length;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar isAdmin={false} />
        <main className="dashboard-content fade-in">
          <div className="dashboard-header flex justify-between items-center bg-white shadow-sm p-4 rounded-md">
            <div>
              <h2>Welcome to your Dashboard</h2>
              <p className="text-secondary">Manage your properties and discover value-boosting ideas</p>
            </div>
            <div className="header-actions flex gap-1 flex-wrap">
              <Link to="/dashboard/add-property" className="btn btn-primary">
                <FaPlus /> Add Property
              </Link>
              <Link to="/saved-properties" className="btn btn-secondary">
                <FaBookmark /> View Saved Properties
              </Link>
              <Link to="/reviews" className="btn btn-secondary">
                <FaStar /> Reviews
              </Link>
              <Link to="/recommendations" className="btn btn-secondary">
                <FaLightbulb /> View Recommendations
              </Link>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card shadow-card">
              <h4>Total Properties</h4>
              <p className="stat-value">{loading ? '…' : total}</p>
            </div>
            <div className="stat-card shadow-card">
              <h4>Potential Value Add</h4>
              <p className="stat-value text-primary">{mockStats.potentialValueIncrease}</p>
            </div>
            <div className="stat-card shadow-card">
              <h4>Average Expected ROI</h4>
              <p className="stat-value text-primary">{mockStats.averageROI}</p>
            </div>
            <div className="stat-card shadow-card">
              <h4>Pending Upgrades</h4>
              <p className="stat-value text-secondary">{mockStats.pendingRecommendations}</p>
            </div>
          </div>

          <div className="properties-section">
            <div className="flex justify-between items-center mb-1 flex-wrap gap-1">
              <h3>My Properties</h3>
              <Link to="/saved-properties" className="text-primary font-bold">
                View all saved →
              </Link>
            </div>
            {loading ? (
              <p className="text-secondary">Loading your properties…</p>
            ) : properties.length === 0 ? (
              <div className="shadow-card p-4 rounded-md">
                <p className="text-secondary mb-2">You have not added any properties yet.</p>
                <Link to="/dashboard/add-property" className="btn btn-primary">
                  <FaPlus /> Add Property
                </Link>
              </div>
            ) : (
              <div className="properties-grid">
                {properties.slice(0, 6).map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
