import React from 'react';
import '../../styles/Realtor/MarketTrends.css';

const MarketTrends = () => {
  return (
    <section className="market-trends">
      <h2>Market Trends</h2>
      <p>Current real estate market insights to help grow your business</p>
      
      <div className="trends-graph">
        <div className="graph-container">
          <div className="graph-header">
            <h3>Local Housing Market Trends (Last 6 Months)</h3>
            <div className="graph-legend">
              <div className="legend-item">
                <span className="legend-color sales-color"></span>
                <span>Sales</span>
              </div>
              <div className="legend-item">
                <span className="legend-color listing-color"></span>
                <span>Listings</span>
              </div>
              <div className="legend-item">
                <span className="legend-color price-color"></span>
                <span>Avg. Price</span>
              </div>
            </div>
          </div>
          
          <div className="graph-visualization">
            {/* Placeholder for actual graph - in a real app, you would use a charting library */}
            <div className="graph-placeholder">
              <div className="graph-y-axis">
                <span>$400k</span>
                <span>$300k</span>
                <span>$200k</span>
                <span>$100k</span>
              </div>
              <div className="graph-bars">
                <div className="graph-month">
                  <div className="bar-group">
                    <div className="bar sales" style={{ height: '60%' }}></div>
                    <div className="bar listings" style={{ height: '80%' }}></div>
                    <div className="bar price" style={{ height: '50%' }}></div>
                  </div>
                  <span>Jan</span>
                </div>
                <div className="graph-month">
                  <div className="bar-group">
                    <div className="bar sales" style={{ height: '65%' }}></div>
                    <div className="bar listings" style={{ height: '75%' }}></div>
                    <div className="bar price" style={{ height: '55%' }}></div>
                  </div>
                  <span>Feb</span>
                </div>
                <div className="graph-month">
                  <div className="bar-group">
                    <div className="bar sales" style={{ height: '75%' }}></div>
                    <div className="bar listings" style={{ height: '65%' }}></div>
                    <div className="bar price" style={{ height: '60%' }}></div>
                  </div>
                  <span>Mar</span>
                </div>
                <div className="graph-month">
                  <div className="bar-group">
                    <div className="bar sales" style={{ height: '85%' }}></div>
                    <div className="bar listings" style={{ height: '60%' }}></div>
                    <div className="bar price" style={{ height: '70%' }}></div>
                  </div>
                  <span>Apr</span>
                </div>
                <div className="graph-month">
                  <div className="bar-group">
                    <div className="bar sales" style={{ height: '90%' }}></div>
                    <div className="bar listings" style={{ height: '50%' }}></div>
                    <div className="bar price" style={{ height: '80%' }}></div>
                  </div>
                  <span>May</span>
                </div>
                <div className="graph-month">
                  <div className="bar-group">
                    <div className="bar sales" style={{ height: '80%' }}></div>
                    <div className="bar listings" style={{ height: '70%' }}></div>
                    <div className="bar price" style={{ height: '85%' }}></div>
                  </div>
                  <span>Jun</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="trends-insights">
          <div className="insight-card">
            <h4>+5.2%</h4>
            <p>Price Growth YoY</p>
          </div>
          <div className="insight-card">
            <h4>-3.8%</h4>
            <p>Inventory Change</p>
          </div>
          <div className="insight-card">
            <h4>15</h4>
            <p>Avg Days to Sell</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketTrends; 