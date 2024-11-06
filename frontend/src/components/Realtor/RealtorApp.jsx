import React from 'react';
import '../../styles/Realtor/global.css';
import Header from './Header';
import PerformanceOverview from './PerformanceOverview';
import GeneratedLeads from './GeneratedLeads';
import RealtorProfileHeader from './RealtorProfileHeader';
import Footer from '../Home/Footer';
import Carousel from './Carousel';

function RealtorApp() {
  return (
    <div className="App">
      <Header />
      <RealtorProfileHeader />
      <PerformanceOverview />
      <GeneratedLeads />
      <Carousel />
      <Footer />
    </div>
  );
}

export default RealtorApp;
