import React from 'react';
import Navbar from '../Navbar';
import Hero from './Hero';
import FeaturedProperties from './FeaturedProperties';
import Services from './Services';
import AiChat from './AiChat';
import RealEstateTrends from './RealEstateTrends';
// Removed ContactUs import temporarily

const HomeApp = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeaturedProperties />
      <Services />
      <AiChat />
      <RealEstateTrends />
      {/* Removed ContactUs component temporarily */}
    </div>
  );
};

export default HomeApp;
