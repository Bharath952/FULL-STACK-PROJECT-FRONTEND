import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { propertyTypes, propertyConditions } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { getStoredUser } from '../utils/authStorage';
import { getApiErrorMessage } from '../utils/apiError';
import './Form.css';

const AddProperty = () => {
  const navigate = useNavigate();
  const user = getStoredUser();

  const [form, setForm] = useState({
    location: '',
    propertyType: '',
    budget: '',
    area: '',
    propertyCondition: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user?.id) {
      setErrorMsg('You must be logged in to save a property.');
      return;
    }

    const budgetNum = Number(String(form.budget).replace(/,/g, ''));
    const areaNum = Number(form.area);
    if (Number.isNaN(budgetNum) || Number.isNaN(areaNum)) {
      setErrorMsg('Please enter valid numbers for budget and area.');
      return;
    }

    const propertyData = {
      location: form.location.trim(),
      propertyType: form.propertyType,
      budget: budgetNum,
      area: areaNum,
      propertyCondition: form.propertyCondition,
      userId: user.id
    };

    console.log('POST /api/properties', propertyData);

    try {
      setLoading(true);
      await API.post('/properties', propertyData);
      navigate('/saved-properties', {
        replace: false,
        state: { successMessage: 'Property saved successfully.' }
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar isAdmin={false} />
        <main className="dashboard-content fade-in">
          <div className="form-container shadow-card">
            <h2>Add New Property</h2>
            <p className="text-secondary mb-2">
              Enter your property details. Data is saved to the server and linked to your account.
            </p>

            {errorMsg ? (
              <div className="form-error-banner" style={{ color: '#c62828', marginBottom: '1rem', fontWeight: 600 }}>
                {errorMsg}
              </div>
            ) : null}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Location (City, Area)</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    placeholder="e.g. Indiranagar, Bangalore"
                    value={form.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Property Type</label>
                  <select
                    name="propertyType"
                    className="form-control"
                    value={form.propertyType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Budget for Renovation (₹)</label>
                  <input
                    type="text"
                    name="budget"
                    className="form-control"
                    placeholder="e.g. 500000"
                    value={form.budget}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Built-up Area (sq ft)</label>
                  <input
                    type="number"
                    name="area"
                    className="form-control"
                    placeholder="e.g. 1500"
                    min="1"
                    step="1"
                    value={form.area}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Current Condition</label>
                  <select
                    name="propertyCondition"
                    className="form-control"
                    value={form.propertyCondition}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Condition</option>
                    {propertyConditions.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-2 flex justify-between">
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving…' : 'Save Property'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddProperty;
