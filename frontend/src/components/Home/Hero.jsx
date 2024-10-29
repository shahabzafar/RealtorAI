import React from 'react';
import '../../styles/Home/Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="containerHero">
        <h2>Welcome to AI Realtor</h2>
        <p>Finding your dream home by pairing a realtor with AI</p>
        <form action="#">
          <input type="text" placeholder="Search by city, address, or postal code" />
          <button type="submit">Get Started</button>
        </form>
      </div>
    </section>
  );
};

export default Hero;
