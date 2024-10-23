import React from 'react';
import '../../styles/Sell/global.css';
import Header from './Header';
import PerformanceOverview from './PerformanceOverview';
import FeaturedProperties from './FeaturedProperties';
import AddNewListing from './AddNewListing';
import SellerProfileHeader from './SellerProfileHeader';

function SellApp() {
  return (
    <div className="App">
      <Header />
      <SellerProfileHeader />
      <PerformanceOverview />
      <FeaturedProperties />
      <AddNewListing />
    </div>
  );
}

export default SellApp;
