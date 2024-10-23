import React from 'react';
import '../../styles/Home/FeaturedProperties.css';

const FeaturedProperties = () => {
  return (
    <section className="featured-properties">
      <div className="containerProp">
        <h3>Featured Properties</h3>
        <div className="property-grid">
          <div className="property">
            <h4>Property 1</h4>
            <p>3 Bedroom House</p>
            <p>$800,000</p>
          </div>
          <div className="property">
            <h4>Property 2</h4>
            <p>2 Bedroom Cottage</p>
            <p>$650,000</p>
          </div>
          <div className="property">
            <h4>Property 3</h4>
            <p>5 Bedroom Villa</p>
            <p>$1,300,000</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
