import React from 'react';
import '../../styles/Home/Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="containerHero">
        <h1 className="hero-title">Find Your Perfect Home</h1>
        <h2 className="hero-subtitle">Powered by AI, Guided by Experts</h2>
        <p className="hero-description">Discover properties tailored to your needs with our AI-powered platform</p>
        <form className="search-form">
          <div className="search-container">
            <input type="text" placeholder="City, neighborhood, or ZIP code" />
            <select className="property-type">
              <option value="">Property Type</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
            </select>
            <select className="price-range">
              <option value="">Price Range</option>
              <option value="0-500000">Under $500K</option>
              <option value="500000-1000000">$500K - $1M</option>
              <option value="1000000+">$1M+</option>
            </select>
            <button type="submit" className="search-button">Search</button>
          </div>
          <div className="search-tags">
            <span className="tag">Popular:</span>
            <a href="#" className="tag">Waterfront</a>
            <a href="#" className="tag">New Build</a>
            <a href="#" className="tag">Smart Home</a>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Hero;
