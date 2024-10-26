import React from 'react';
import '../../styles/Realtor/PerformanceOverview.css';

const PerformanceOverview = () => {
  return (
    <section className="performance-overview">
      <h2>Performance Overview</h2>
      <p>Check your selling metrics at a glance</p>
      <button className="view-details">View Details</button>

      <div className="stats">
        <div className="stat-box">
          <span className="stat-title">Total Properties Listed</span>
          <span className="stat-value">30</span>
        </div>
        <div className="stat-box">
          <span className="stat-title">Properties Sold</span>
          <span className="stat-value">15</span>
        </div>
        <div className="stat-box">
          <span className="stat-title">Average Selling Price</span>
          <span className="stat-value">$250,000</span>
        </div>
      </div>

      <div className="sales-trends">
        <h3>Sales Trends</h3>
        <div className="sales-chart">
          {/* Placeholder for the sales chart */}
        </div>
      </div>
    </section>
  );
};

export default PerformanceOverview;
