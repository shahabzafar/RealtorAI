import React from 'react';
import Navbar from '../Navbar';
import Hero from './Hero';
import FeaturedProperties from './FeaturedProperties';
import Services from './Services';
import AiChat from './AiChat';
import RealEstateTrends from './RealEstateTrends';
import InteractiveGraphs from './InteractiveGraphs';

const HomeApp = ({ user, onLogout }) => {
  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />
      <Hero />
      <FeaturedProperties />
      <Services />
      <InteractiveGraphs />
      <AiChat />
      <RealEstateTrends />
    </div>
  );
};

export default HomeApp;
