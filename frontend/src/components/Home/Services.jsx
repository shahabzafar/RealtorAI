import React from 'react';
import { FaChartLine, FaSearchDollar, FaChartBar, FaRegChartBar } from 'react-icons/fa';
import '../../styles/Home/Services.css';

const Services = () => {
  return (
    <section className="services-section">
      <div className="services-container">
        <h2 className="services-heading">Our Tools</h2>
        <p className="services-description">Advanced AI-powered tools to enhance your real estate experience</p>
        
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">
              <FaSearchDollar />
            </div>
            <div className="service-image-container">
              <img src={process.env.PUBLIC_URL + "/images/propertyvaluation.png"} alt="Property Valuation" />
            </div>
            <div className="service-details">
              <p>Property Valuation</p>
              <p className="description">Accurate property values using advanced machine learning algorithms.</p>
            </div>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <FaChartLine />
            </div>
            <div className="service-image-container">
              <img src={process.env.PUBLIC_URL + "/images/markettrends.jpg"} alt="Market Insights" />
            </div>
            <div className="service-details">
              <p>Market Insights</p>
              <p className="description">Get informed with real-time market trends and predictions.</p>
            </div>
          </div>
          
          <div className="service-card">
            <div className="service-icon">
              <FaChartBar />
            </div>
            <div className="service-image-container">
              <img src={process.env.PUBLIC_URL + "/images/download.jpeg"} alt="Sentiment Analyser" />
            </div>
            <div className="service-details">
              <p>Sentiment Analyser</p>
              <p className="description">Analyze market sentiment and buyer behavior with our AI technology.</p>
            </div>
          </div>
          
          <div className="service-card">
            <div className="service-icon">
              <FaRegChartBar />
            </div>
            <div className="service-image-container">
              <img src={process.env.PUBLIC_URL + "/images/download (1).png"} alt="Market Price Trends" />
            </div>
            <div className="service-details">
              <p>Market Price Trends</p>
              <p className="description">Visualize and forecast property price trends in your target market.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
