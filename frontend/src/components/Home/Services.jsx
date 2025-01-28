import React from 'react';
import '../../styles/Home/Services.css';

const Services = () => {
  return (
    <section className="services-section">
      <div className="services-container">
        <h2 className="services-heading">Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-image-container">
              <img src={process.env.PUBLIC_URL + "/images/propertyvaluation.png"} alt="Property Valuation" />
            </div>
            <div className="service-details">
              <p>Property Valuation</p>
              <p className="description">Accurate property values using advanced machine learning algorithms.</p>
            </div>
          </div>

          <div className="service-card">
            <div className="service-image-container">
              <img src={process.env.PUBLIC_URL + "/images/markettrends.jpg"} alt="Market Insights" />
            </div>
            <div className="service-details">
              <p>Market Insights</p>
              <p className="description">Get informed with real-time market trends and predictions.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
