import React, { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { getStoredUser } from '../utils/authStorage';
import { getApiErrorMessage } from '../utils/apiError';
import './Reviews.css';

function StarDisplay({ rating }) {
  const r = Math.min(5, Math.max(0, Number(rating) || 0));
  return (
    <span className="star-display" aria-label={`${r} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= r ? 'star star-on' : 'star star-off'}>
          ★
        </span>
      ))}
    </span>
  );
}

const Reviews = () => {
  const user = getStoredUser();

  const [reviews, setReviews] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingProps, setLoadingProps] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    username: user?.name || user?.email || '',
    message: '',
    rating: 5,
    propertyId: ''
  });

  const fetchReviews = useCallback(async () => {
    setErrorMsg('');
    try {
      setLoadingList(true);
      const { data } = await API.get('/reviews');
      console.log('GET /api/reviews', data);
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('GET /api/reviews failed', err);
      setErrorMsg(getApiErrorMessage(err));
      setReviews([]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  const fetchProperties = useCallback(async () => {
    if (!user?.id) {
      setProperties([]);
      setLoadingProps(false);
      return;
    }
    try {
      setLoadingProps(true);
      const { data } = await API.get(`/properties/user/${user.id}`);
      console.log('GET /api/properties/user/' + user.id, data);
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load properties for review form', err);
      setProperties([]);
    } finally {
      setLoadingProps(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    if (properties.length === 0) return;
    setForm((prev) => {
      if (prev.propertyId !== '') return prev;
      return { ...prev, propertyId: String(properties[0].id) };
    });
  }, [properties]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const propertyId = form.propertyId === '' ? NaN : Number(form.propertyId);
    if (Number.isNaN(propertyId) || propertyId < 1) {
      setErrorMsg('Select or enter a valid property ID.');
      return;
    }

    const payload = {
      username: form.username.trim(),
      message: form.message.trim(),
      rating: Number(form.rating),
      propertyId
    };

    console.log('POST /api/reviews', payload);

    try {
      setSubmitting(true);
      await API.post('/reviews', payload);
      setSuccessMsg('Review submitted successfully.');
      setForm((prev) => ({
        ...prev,
        message: '',
        rating: 5
      }));
      await fetchReviews();
    } catch (err) {
      console.error('POST /api/reviews failed', err);
      setErrorMsg(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar isAdmin={false} />
        <main className="dashboard-content fade-in reviews-page">
          <div className="dashboard-header flex justify-between items-center bg-white shadow-sm p-4 rounded-md">
            <div>
              <h2>Property Reviews</h2>
              <p className="text-secondary">Share feedback linked to a property in the database</p>
            </div>
          </div>

          {successMsg ? (
            <div className="reviews-banner reviews-banner-success" role="status">
              {successMsg}
            </div>
          ) : null}
          {errorMsg ? (
            <div className="reviews-banner reviews-banner-error" role="alert">
              {errorMsg}
            </div>
          ) : null}

          <section className="reviews-form-card shadow-card">
            <h3>Add a review</h3>
            <p className="text-secondary mb-2">
              The property must already exist (e.g. add a property first, then pick it below).
            </p>
            <form onSubmit={handleSubmit}>
              <div className="reviews-form-grid">
                <div className="form-group">
                  <label htmlFor="rev-username">Username</label>
                  <input
                    id="rev-username"
                    name="username"
                    className="form-control"
                    value={form.username}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rev-property">Property</label>
                  {loadingProps ? (
                    <p className="text-secondary">Loading your properties…</p>
                  ) : properties.length > 0 ? (
                    <select
                      id="rev-property"
                      name="propertyId"
                      className="form-control"
                      value={form.propertyId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a property</option>
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          #{p.id} — {p.location} ({p.propertyType || p.type})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <>
                      <input
                        id="rev-property"
                        name="propertyId"
                        type="number"
                        min="1"
                        className="form-control"
                        value={form.propertyId}
                        onChange={handleChange}
                        placeholder="Property ID (must exist in DB)"
                        required
                      />
                      <small className="text-secondary">
                        No saved properties found. Add a property first, or enter an existing property ID.
                      </small>
                    </>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="rev-rating">Rating</label>
                  <select
                    id="rev-rating"
                    name="rating"
                    className="form-control"
                    value={form.rating}
                    onChange={handleChange}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'star' : 'stars'}
                      </option>
                    ))}
                  </select>
                  <div className="rating-preview">
                    Preview: <StarDisplay rating={Number(form.rating)} />
                  </div>
                </div>
                <div className="form-group reviews-message-full">
                  <label htmlFor="rev-message">Message</label>
                  <textarea
                    id="rev-message"
                    name="message"
                    className="form-control"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    required
                    placeholder="Your experience with this property…"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-2" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit review'}
              </button>
            </form>
          </section>

          <section className="reviews-list-section">
            <h3 className="mb-2">All reviews</h3>
            {loadingList ? (
              <p className="text-secondary">Loading reviews…</p>
            ) : reviews.length === 0 ? (
              <p className="text-secondary">No reviews yet. Be the first to add one.</p>
            ) : (
              <div className="reviews-grid">
                {reviews.map((rev) => (
                  <article key={rev.id} className="review-card shadow-card">
                    <div className="review-card-header">
                      <span className="review-name">{rev.username}</span>
                      <StarDisplay rating={rev.rating} />
                    </div>
                    <p className="review-meta">Property ID: {rev.propertyId}</p>
                    <p className="review-message">{rev.message}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Reviews;
