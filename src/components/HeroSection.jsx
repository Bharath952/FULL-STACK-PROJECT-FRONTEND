import React from 'react';
import { Link } from 'react-router-dom';
import FeatureCard from './FeatureCard';

const HeroSection = () => {
  return (
    <section className="hero-section" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', paddingTop: '4rem' }}>
      <div className="container flex justify-between items-center" style={{ gap: '4rem', flexWrap: 'wrap' }}>
        
        {/* Left Side Content */}
        <div className="hero-content" style={{ flex: '1', minWidth: '300px', maxWidth: '600px' }}>
          <div className="badge fade-in" style={{ 
            display: 'inline-block', 
            padding: '0.4rem 1rem', 
            borderRadius: '50px', 
            backgroundColor: 'rgba(99, 102, 241, 0.1)', 
            color: '#6366f1', 
            fontWeight: '600',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            Smart Property Solutions
          </div>
          
          <h1 className="fade-in" style={{ 
            fontSize: '3.5rem', 
            lineHeight: '1.2', 
            fontWeight: '800', 
            marginBottom: '1.5rem',
            color: '#0f172a'
          }}>
            Increase Your Property Value, <span className="text-gradient">Digitally</span>
          </h1>
          
          <p className="text-secondary fade-in" style={{ 
            fontSize: '1.1rem', 
            marginBottom: '2.5rem', 
            animationDelay: '0.2s',
            lineHeight: '1.6'
          }}>
            Get smart recommendations to enhance your home's value with modern upgrades and data-driven market insights.
          </p>
          
          <div className="flex gap-1 fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/signup" className="btn btn-gradient" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Get Started</Link>
            <Link to="/login" className="btn btn-light" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Sign In</Link>
          </div>
        </div>

        {/* Right Side Visual */}
        <div className="hero-visual fade-in" style={{ flex: '1', minWidth: '300px', position: 'relative', animationDelay: '0.6s' }}>
          <div 
            className="glass-card" 
            style={{ 
              height: '450px', 
              width: '100%', 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.3))',
              borderRadius: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2rem',
              position: 'relative',
              zIndex: 1
            }}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }} className="text-gradient">Dashboard Snapshot</h3>
            <div style={{ width: '100%', height: '100%', background: '#f8fafc', borderRadius: '1rem', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)' }}></div>
          </div>

          {/* Floating Min-cards */}
          <div style={{ position: 'absolute', top: '10%', left: '-10%', zIndex: 2 }}>
            <FeatureCard title="24/7 Support" icon="support" delay="0.8s" />
          </div>
          <div style={{ position: 'absolute', bottom: '20%', left: '-5%', zIndex: 2 }}>
            <FeatureCard title="High ROI Suggestions" icon="roi" delay="1s" />
          </div>
          <div style={{ position: 'absolute', top: '25%', right: '-10%', zIndex: 2 }}>
            <FeatureCard title="Secure Data" icon="secure" delay="0.9s" />
          </div>
          <div style={{ position: 'absolute', bottom: '10%', right: '5%', zIndex: 2 }}>
            <FeatureCard title="Market Insights" icon="insights" delay="1.1s" />
          </div>
          
          {/* Decorative Blur Orbs */}
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px', background: 'rgba(99, 102, 241, 0.3)', filter: 'blur(60px)', borderRadius: '50%', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '200px', height: '200px', background: 'rgba(14, 165, 233, 0.3)', filter: 'blur(60px)', borderRadius: '50%', zIndex: 0 }}></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
