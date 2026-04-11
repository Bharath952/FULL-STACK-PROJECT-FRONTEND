import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './About.css';

const About = () => {
  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content about-main fade-in">
        <section className="container about-hero">
          <h1 className="about-title">
            About <span className="text-gradient">Indian Heritage Explorer</span>
          </h1>
          <p className="about-subtitle text-secondary">
            A frontend-only experience showcasing monuments, interactive virtual-tour slides, and an Indian culture quiz using dummy data.
          </p>
        </section>

        <section className="container about-grid">
          <div className="about-card shadow-card">
            <div className="about-card-title text-gradient">Explore monuments</div>
            <p className="about-card-body text-secondary">
              Browse a curated set of heritage sites. Use search and filters to quickly find forts, temples, and UNESCO-listed monuments.
            </p>
          </div>

          <div className="about-card shadow-card">
            <div className="about-card-title text-gradient">Virtual tour slides</div>
            <p className="about-card-body text-secondary">
              Start a guided “virtual tour” using a smooth image carousel and a simple guide explanation—no backend required.
            </p>
          </div>

          <div className="about-card shadow-card">
            <div className="about-card-title text-gradient">Heritage quiz</div>
            <p className="about-card-body text-secondary">
              Test your knowledge with multiple-choice questions. After submission, you get your score plus explanations.
            </p>
          </div>

          <div className="about-card shadow-card">
            <div className="about-card-title text-gradient">Modern & responsive UI</div>
            <p className="about-card-body text-secondary">
              Designed with card layouts, hover effects, consistent heritage tones (saffron, white, green), and mobile-friendly spacing.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;

