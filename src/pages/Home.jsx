import React, { useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MonumentCard from '../components/MonumentCard';
import heritageData from '../data/heritageData.json';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [monuments] = React.useState(() => {
    const raw = localStorage.getItem('heritage_monuments');
    if (!raw) return heritageData.monuments;
    try {
      const val = JSON.parse(raw);
      if (Array.isArray(val) && val.length > 0) return val;
    } catch {
      // ignore
    }
    return heritageData.monuments;
  });

  const featured = useMemo(() => {
    // Pick a balanced mix for the landing page.
    const picks = ['taj-mahal', 'qutub-minar', 'red-fort', 'konark-sun-temple'];
    const map = new Map(monuments.map((m) => [m.id, m]));
    return picks.map((id) => map.get(id)).filter(Boolean);
  }, [monuments]);

  return (
    <div className="page-wrapper bg-gradient-main">
      <Navbar />

      <main className="main-content home-main">
        <section className="heritage-hero fade-in">
          <div className="container hero-inner">
            <div className="hero-copy">
              <div className="badge heritage-badge">Indian Culture • History • Monuments</div>
              <h1 className="hero-title">
                Explore <span className="text-gradient">Indian Heritage</span>
              </h1>
              <p className="hero-subtitle">
                Discover iconic places, learn through guided virtual tours, and test your knowledge with a culture quiz.
              </p>

              <div className="hero-actions">
                <Link to="/monuments" className="btn btn-gradient" aria-label="Browse monuments">
                  Browse Monuments
                </Link>
                <Link to="/quiz" className="btn btn-light" aria-label="Start quiz">
                  Take the Heritage Quiz
                </Link>
              </div>
            </div>

            <div className="hero-right glass-card">
              <div className="hero-right-title text-gradient">Today’s Highlights</div>
              <div className="hero-right-grid">
                <div className="mini-stat">
                  <div className="mini-stat-value">{monuments.length}</div>
                  <div className="mini-stat-label">Monuments</div>
                </div>
                <div className="mini-stat">
                  <div className="mini-stat-value">{heritageData.quizQuestions.length}</div>
                  <div className="mini-stat-label">Quiz Questions</div>
                </div>
                <div className="mini-stat">
                  <div className="mini-stat-value">
                    {monuments.filter((m) => m.unesco).length}
                  </div>
                  <div className="mini-stat-label">UNESCO Sites</div>
                </div>
                <div className="mini-stat">
                  <div className="mini-stat-value">Virtual</div>
                  <div className="mini-stat-label">Guided Tours</div>
                </div>
              </div>
              <p className="hero-right-note text-secondary">
                Smooth slides, clear explanations, and a modern interface—built as a frontend-only experience.
              </p>
            </div>
          </div>
        </section>

        <section className="container featured-section fade-in">
          <div className="section-header">
            <h2 className="section-title">Featured Monuments</h2>
            <p className="text-secondary">Start with a quick selection and jump into details anytime.</p>
          </div>

          <div className="featured-grid">
            {featured.map((monument) => (
              <MonumentCard key={monument.id} monument={monument} defaultShowLike={false} compact />
            ))}
          </div>

          <div className="text-center mt-2">
            <Link to="/monuments" className="btn btn-secondary">
              View all monuments
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
