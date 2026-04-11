import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PropertyCard from '../components/PropertyCard';
import API from '../services/api';
import { getStoredUser } from '../utils/authStorage';
import { getApiErrorMessage } from '../utils/apiError';
import './SavedProperties.css';

const SavedProperties = () => {
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState('');

  const user = getStoredUser();

  const load = useCallback(async () => {
    if (!user?.id) {
      setError('Missing user session. Please log in again.');
      setLoading(false);
      return;
    }
    setError('');
    try {
      setLoading(true);
      const { data } = await API.get(`/properties/user/${user.id}`);
      console.log('GET /api/properties/user/' + user.id, data);
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err));
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (location.state?.successMessage) {
      setBanner(location.state.successMessage);
    }
  }, [location.state]);

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar isAdmin={false} />
        <main className="dashboard-content fade-in">
          <div className="dashboard-header flex justify-between items-center bg-white shadow-sm p-4 rounded-md">
            <div>
              <h2>Saved Properties</h2>
              <p className="text-secondary">Properties stored in your account</p>
            </div>
            <div className="header-actions flex gap-1">
              <Link to="/dashboard/add-property" className="btn btn-primary">
                Add Property
              </Link>
              <Link to="/dashboard" className="btn btn-secondary">
                Back to Dashboard
              </Link>
            </div>
          </div>

          {banner ? (
            <div className="success-banner" role="status">
              {banner}
            </div>
          ) : null}

          {error ? (
            <p className="saved-props-error" role="alert">
              {error}
            </p>
          ) : null}

          {loading ? (
            <p className="text-secondary">Loading properties…</p>
          ) : properties.length === 0 && !error ? (
            <div className="empty-saved shadow-card">
              <p>No saved properties yet.</p>
              <Link to="/dashboard/add-property" className="btn btn-primary mt-1">
                Add your first property
              </Link>
            </div>
          ) : (
            <div className="properties-grid">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SavedProperties;
