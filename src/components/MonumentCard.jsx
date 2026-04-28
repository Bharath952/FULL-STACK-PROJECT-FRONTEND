import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaMapMarkerAlt } from 'react-icons/fa';
import './MonumentCard.css';

const MonumentCard = ({
  monument,
  compact = false,
  defaultShowLike = true,
  liked,
  onToggleLike
}) => {
  const showLike = typeof onToggleLike === 'function' && defaultShowLike !== false;
  const likeIcon = liked ? <FaHeart /> : <FaRegHeart />;

  return (
    <div className={`monument-card shadow-card fade-in ${compact ? 'compact' : ''}`}>
      <div className="monument-image-wrapper">
        <img className="monument-image" src={monument.images?.[0]?.src} alt={monument.images?.[0]?.alt || monument.name} />

        <div className="monument-overlay">
          <span className={`monument-chip ${monument.unesco ? 'unesco' : ''}`}>
            {monument.unesco ? 'UNESCO' : monument.category}
          </span>

          {showLike ? (
            <button
              type="button"
              className={`like-btn ${liked ? 'liked' : ''}`}
              onClick={() => onToggleLike(monument.id)}
              aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
            >
              {likeIcon}
            </button>
          ) : null}
        </div>
      </div>

      <div className="monument-body">
        <h3 className="monument-title">{monument.name}</h3>
        <p className="monument-location">
          <FaMapMarkerAlt /> {monument.location}
        </p>

        {!compact ? (
          <>
            <p className="monument-category text-secondary">{monument.category}</p>
            <p className="monument-description text-secondary">
              {monument.description?.length > 160 ? `${monument.description.slice(0, 160)}…` : monument.description}
            </p>
          </>
        ) : null}

        <div className="monument-actions">
          <Link to={`/monuments/${monument.id}`} className="btn btn-primary monument-details-btn">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MonumentCard;
