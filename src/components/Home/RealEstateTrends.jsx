import React from 'react';
import '../../styles/Home/RealEstateTrends.css';

const RealEstateTrends = () => {
  return (
    <section className="real-estate-trends">
      <div className="container">
        <h3>Real Estate Trends</h3>
        <div className="trend-grid">
          <div className="trend">
            <h4>Average Home Price</h4>
            <p>$400,000</p>
          </div>
          <div className="trend">
            <h4>Market Listings</h4>
            <p>1000</p>
          </div>
          <div className="trend">
            <h4>Days on the Market</h4>
            <p>30</p>
          </div>
          <div className="market-performance">
            <h4>Market Performance</h4>
            <div className="chart-placeholder">Chart</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealEstateTrends;
