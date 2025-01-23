import React from 'react';
import '../../styles/Realtor/global.css';
import Header from './Header';
import PerformanceOverview from './PerformanceOverview';
import GeneratedLeads from './GeneratedLeads';
import RealtorProfileHeader from './RealtorProfileHeader';
import Footer from '../Home/Footer';
import Carousel from './Carousel';
import AiChat from './AiChat';

function RealtorApp({ user, onLogout }) {
  return (
    <div className="App">
      <Header user={user} onLogout={onLogout} />
      <RealtorProfileHeader user={user} />
      <PerformanceOverview />
      <GeneratedLeads />
      <div className="ai-chat-container">
        <AiChat />
      </div>
      <Carousel />
      <Footer />
    </div>
  );
}

export default RealtorApp;
