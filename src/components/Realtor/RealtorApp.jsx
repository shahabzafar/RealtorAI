import React from 'react';
import '../../styles/Realtor/global.css';
import Header from './Header';
import PerformanceOverview from './PerformanceOverview';
import GeneratedLeads from './GeneratedLeads';
import RealtorProfileHeader from './RealtorProfileHeader';
import Footer from '../Home/Footer';

function RealtorApp() {
  return (
    <div className="App">
      <Header />
      <RealtorProfileHeader />
      <PerformanceOverview />
      <GeneratedLeads />
      <Footer />
    </div>
  );
}

export default RealtorApp;
