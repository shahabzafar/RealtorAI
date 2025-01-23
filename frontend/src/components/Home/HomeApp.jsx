import React from 'react';
import Header from './Header';
import Hero from './Hero';
import FeaturedProperties from './FeaturedProperties';
import Services from './Services';
import RealEstateTrends from './RealEstateTrends';
import Footer from './Footer';
import '../../styles/Home/global.css';

const HomeApp = ({ user, onLogout }) => {
  return (
    <div>
      <Header user={user} onLogout={onLogout} />
      <Hero />
      <FeaturedProperties />
      <Services />
      <RealEstateTrends />
      <Footer />
    </div>
  );
};

export default HomeApp;
