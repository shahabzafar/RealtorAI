import React from 'react';
import '../../styles/Home/Services.css';


const Services = () => {
  return (
    <section className="services">
      <div className="container">
        <h3>Our Services</h3>
        <div className="service-grid">
          <div className="service">
            <h4>Property Valuation</h4>
            <p>Accurate property values using advanced machine learning algorithms.</p>
          </div>
          <div className="service">
            <h4>Market Insights</h4>
            <p>Get informed with real-time market trends and predictions.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
