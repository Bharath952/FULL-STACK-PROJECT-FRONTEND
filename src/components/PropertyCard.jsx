import React from 'react';
import { FaMapMarkerAlt, FaHome, FaRupeeSign, FaCheckCircle } from 'react-icons/fa';
import './PropertyCard.css';

const PLACEHOLDER_IMG =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60';

function formatBudget(property) {
  const b = property.budget;
  if (b == null || b === '') return '—';
  if (typeof b === 'number') return `₹${b.toLocaleString('en-IN')}`;
  return String(b);
}

function formatArea(property) {
  const a = property.area;
  if (a == null || a === '') return '—';
  if (typeof a === 'number') return `${a} sq ft`;
  return String(a);
}

const PropertyCard = ({ property }) => {
  const type = property.propertyType || property.type;
  const condition = property.propertyCondition || property.condition;
  const image = property.image || PLACEHOLDER_IMG;
  const hasEstimate =
    property.estimatedValue != null && typeof property.estimatedValue === 'number';

  return (
    <div className="property-card shadow-card fade-in">
      <div className="property-image-wrapper">
        <img src={image} alt={type || 'Property'} className="property-image" />
        <span className="property-condition-badge">{condition || '—'}</span>
      </div>
      <div className="property-content">
        <h3 className="property-title">
          <FaHome className="text-primary" /> {type}
        </h3>
        <p className="property-location text-secondary">
          <FaMapMarkerAlt /> {property.location || '—'}
        </p>
        <div className="property-details">
          <div className="detail-item">
            <span className="detail-label">Area</span>
            <span className="detail-val">{formatArea(property)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Budget</span>
            <span className="detail-val">{formatBudget(property)}</span>
          </div>
        </div>
        {hasEstimate ? (
          <div className="property-value-section">
            <span className="value-label">Current Estimated Value</span>
            <h4 className="value-amount">
              <FaRupeeSign size={14} /> {(property.estimatedValue / 100000).toFixed(2)} Lakhs
            </h4>
          </div>
        ) : null}
        <button type="button" className="btn btn-secondary w-full mt-1">
          <FaCheckCircle /> View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
