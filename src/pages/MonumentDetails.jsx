import React, { useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import heritageData from '../data/heritageData.json';
import ImageCarousel from '../components/ImageCarousel';
import MonumentCard from '../components/MonumentCard';
import { getStoredUser } from '../utils/authStorage';
import './MonumentDetails.css';

const monumentsKey = 'heritage_monuments';

const getFavoritesStorageKey = (user) => {
  const suffix = user?.id ? String(user.id) : 'anon';
  return `heritage_favorites_${suffix}`;
};

const parseFavorites = (raw) => {
  try {
    const val = raw ? JSON.parse(raw) : [];
    if (Array.isArray(val)) return val;
    return [];
  } catch {
    return [];
  }
};

const MonumentDetails = () => {
  const { id } = useParams();
  const user = getStoredUser();
  const tourRef = useRef(null);

  const [monuments] = useState(() => {
    const raw = localStorage.getItem(monumentsKey);
    if (!raw) return heritageData.monuments;
    try {
      const val = JSON.parse(raw);
      if (Array.isArray(val) && val.length > 0) return val;
    } catch {
      // ignore
    }
    return heritageData.monuments;
  });

  const monument = useMemo(
    () => monuments.find((m) => String(m.id) === String(id)),
    [id, monuments]
  );

  const [tourStarted, setTourStarted] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    const key = getFavoritesStorageKey(user);
    return parseFavorites(localStorage.getItem(key));
  });

  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);
  const liked = monument ? favoritesSet.has(monument.id) : false;

  const onToggleLike = (monumentId) => {
    const key = getFavoritesStorageKey(user);
    setFavorites((prev) => {
      const set = new Set(prev);
      if (set.has(monumentId)) set.delete(monumentId);
      else set.add(monumentId);
      const next = Array.from(set);
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };

  const [comments, setComments] = useState(() => monument?.comments || []);
  const [commentName, setCommentName] = useState(user?.name || 'Guest');
  const [commentMsg, setCommentMsg] = useState('');

  const [commentError, setCommentError] = useState('');

  if (!monument) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main className="main-content fade-in">
          <div className="container">
            <h1 className="page-title">Monument not found</h1>
            <p className="text-secondary">The selected monument does not exist in the demo data.</p>
            <Link to="/monuments" className="btn btn-gradient">
              Back to Monuments
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const videoUrl = monument.videoUrl;

  const handleStartTour = () => {
    setTourStarted(true);
    // Smooth scroll into view of the virtual tour section.
    window.setTimeout(() => {
      tourRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    setCommentError('');
    const trimmed = commentMsg.trim();
    if (trimmed.length < 3) {
      setCommentError('Please write a short comment (at least 3 characters).');
      return;
    }
    const name = commentName.trim() || 'Guest';
    setComments((prev) => [
      ...prev,
      {
        name,
        message: trimmed
      }
    ]);
    setCommentMsg('');
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content fade-in">
        <div className="container details-container">
          <div className="details-top">
            <div className="details-back">
              <Link to="/monuments" className="btn btn-light">
                ← Back to Monuments
              </Link>
            </div>

            <div className="details-title-wrap">
              <h1 className="page-title">{monument.name}</h1>
              <p className="text-secondary details-meta">
                {monument.category} • {monument.location}
              </p>
            </div>
          </div>

          <ImageCarousel
            images={monument.images}
            autoplay={false}
            height="large"
            ariaLabel={`${monument.name} gallery`}
          />

          <section className="details-grid">
            <div className="details-left">
              <div className="glass-card details-panel">
                <h2 className="details-panel-title">About this Monument</h2>
                <p className="details-description">{monument.description}</p>

                <div className="details-actions">
                  <button type="button" className="btn btn-gradient" onClick={handleStartTour}>
                    Start Virtual Tour
                  </button>
                  <button
                    type="button"
                    className={`btn ${liked ? 'btn-gradient' : 'btn-secondary'} like-inline`}
                    onClick={() => onToggleLike(monument.id)}
                  >
                    {liked ? 'Saved to Favorites' : 'Add to Favorites'}
                  </button>
                </div>

                {videoUrl ? (
                  <div className="video-wrap" aria-label="Monument video">
                    <iframe
                      title={monument.name}
                      src={videoUrl}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="video-placeholder text-secondary">
                    Video embed is optional in this demo.
                  </div>
                )}
              </div>
            </div>

            <div className="details-right" ref={tourRef}>
              <div className="glass-card details-panel">
                <h2 className="details-panel-title">Virtual Tour Guide</h2>
                <p className="text-secondary">
                  {tourStarted ? 'Follow the guide below. Use the arrows or autoplay for a smooth walkthrough.' : 'Click “Start Virtual Tour” to begin guided slides.'}
                </p>

                {tourStarted ? (
                  <>
                    <div className="tour-carousel">
                      <ImageCarousel
                        images={monument.images}
                        autoplay={true}
                        intervalMs={3200}
                        height="default"
                        ariaLabel="Virtual tour slideshow"
                      />
                    </div>
                    <div className="tour-guide">
                      <h3 className="tour-guide-title text-gradient">Your Guide</h3>
                      <p className="tour-guide-text">{monument.tourDescription}</p>
                    </div>
                  </>
                ) : (
                  <div className="tour-preview">
                    <MonumentCard monument={monument} defaultShowLike={false} compact />
                    <p className="text-secondary mt-1">When you start the tour, this area turns into a guided slideshow.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="comments-section">
            <div className="comments-header">
              <h2 className="details-panel-title">Comments</h2>
              <p className="text-secondary">Static demo comments + your local input (frontend only).</p>
            </div>

            <div className="comments-list">
              {comments.length === 0 ? (
                <div className="text-secondary">No comments yet.</div>
              ) : (
                comments.map((c, idx) => (
                  <article key={`${c.name}-${idx}`} className="comment-card shadow-card">
                    <div className="comment-name">{c.name}</div>
                    <div className="comment-message">{c.message}</div>
                  </article>
                ))
              )}
            </div>

            <form className="comment-form" onSubmit={handleAddComment}>
              <div className="comment-form-grid">
                <div className="form-group">
                  <label htmlFor="comment-name">Name</label>
                  <input
                    id="comment-name"
                    className="form-control"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="comment-message">Comment</label>
                  <textarea
                    id="comment-message"
                    className="form-control"
                    rows={4}
                    value={commentMsg}
                    onChange={(e) => setCommentMsg(e.target.value)}
                    placeholder="Write something about what you learned…"
                  />
                  {commentError ? <div className="field-error">{commentError}</div> : null}
                </div>
              </div>

              <div className="comment-actions">
                <button type="submit" className="btn btn-gradient">
                  Post Comment
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MonumentDetails;
