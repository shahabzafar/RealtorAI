import React from 'react';
import '../../styles/Sell/FeaturedProperties.css';

const FeaturedProperties = () => {
  return (
    <section className="featured-properties">
      <h3>Featured Properties</h3>
      <div className="property-list">
        <div className="property-item">
          <div className="property-image"></div>
          <h4>Modern Loft</h4>
          <p>$300,000</p>
        </div>
        <div className="property-item">
          <div className="property-image"></div>
          <h4>Cozy Townhouse</h4>
          <p>$200,000</p>
        </div>
        <div className="property-item">
          <div className="property-image"></div>
          <h4>Spacious Villa</h4>
          <p>$500,000</p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
