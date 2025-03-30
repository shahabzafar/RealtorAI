import React from 'react';
import Navbar from '../Navbar';
import Hero from './Hero';
import FeaturedProperties from './FeaturedProperties';
import Services from './Services';
import InteractiveGraphs from './InteractiveGraphs';
import AiChat from './AiChat';
import '../../styles/Home/HomeApp.css';

const HomeApp = ({ user, onLogout }) => {
  return (
    <div className="home-app">
      <Navbar user={user} onLogout={onLogout} />
      <main className="home-main">
        <Hero />
        <FeaturedProperties />
        <Services />
        <InteractiveGraphs />
        <AiChat />
      </main>
    </div>
  );
};

export default HomeApp;
