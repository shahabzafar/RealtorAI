import React from 'react';
import Navbar from '../Navbar';
import Hero from './Hero';
import FeaturedProperties from './FeaturedProperties';
import Services from './Services';
import AiChat from './AiChat';
import InteractiveGraphs from './InteractiveGraphs';
import ChatBot from './ChatBot';

const HomeApp = ({ user, onLogout }) => {
  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />
      <Hero />
      <FeaturedProperties />
      <Services />
      <InteractiveGraphs />
      <AiChat />
      <ChatBot />
    </div>
  );
};

export default HomeApp;
