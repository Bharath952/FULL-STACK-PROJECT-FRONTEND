import React from 'react';

const StatsSection = () => {
  const stats = [
    { label: "Properties Enhanced", value: "10,000+" },
    { label: "Active Investors", value: "5,000+" },
    { label: "Average ROI Boost", value: "24.5%" },
    { label: "Data Points Analyzed", value: "2M+" }
  ];

  return (
    <section className="container mt-4 mb-4" style={{ padding: '4rem 0' }}>
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '2rem' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="flex-col items-center text-center fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
            <h2 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{stat.value}</h2>
            <p className="text-secondary" style={{ fontSize: '1rem', fontWeight: '500' }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
