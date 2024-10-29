import React from 'react';
import Header from './Header';
import Hero from './Hero';
import FeaturedProperties from './FeaturedProperties';
import Services from './Services';
import AiChat from './AiChat';
import RealEstateTrends from './RealEstateTrends';
import Footer from './Footer';
import '../../styles/Home/global.css';

const HomeApp = () => {  
  return (
    <div>
      <Header />
      <Hero />
      <FeaturedProperties />
      <Services />
      <AiChat />
      <RealEstateTrends />
      <Footer />
    </div>
  );
};

export default HomeApp;
