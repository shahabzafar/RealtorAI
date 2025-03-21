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
          <span className="stat-title">Properties</span>
          <div className="combined-stat">
            <div className="stat-subitem">
              <span className="stat-label">Listed</span>
              <span className="stat-subvalue">30</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-subitem">
              <span className="stat-label">Sold</span>
              <span className="stat-subvalue">15</span>
            </div>
          </div>
        </div>
        
        <div className="stat-box">
          <span className="stat-title">Clients</span>
          <div className="combined-stat">
            <div className="stat-subitem">
              <span className="stat-label">Total</span>
              <span className="stat-subvalue">24</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-subitem">
              <span className="stat-label">Active</span>
              <span className="stat-subvalue">8</span>
            </div>
          </div>
        </div>
        
        <div className="stat-box">
          <span className="stat-title">Average Selling Price</span>
          <span className="stat-value">$250,000</span>
        </div>
        
        <div className="stat-box">
          <span className="stat-title">Commission</span>
          <div className="combined-stat">
            <div className="stat-subitem">
              <span className="stat-label">Total</span>
              <span className="stat-subvalue">$45,000</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-subitem">
              <span className="stat-label">Transactions</span>
              <span className="stat-subvalue">12</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceOverview;
