import React from 'react';
import '../../styles/Sell/SellerProfileHeader.css';

const SellerProfileHeader = () => {
  return (
    <section className="seller-profile-header">
      <div className="profile-info">
        <div className="profile-image">
          {/* Placeholder for profile image */}
          <div className="circle-placeholder"></div>
        </div>
        <div className="profile-text">
          <h2>User name (Seller Profile)</h2>
          <div className="badge">Top Seller</div>
          <p>Welcome to your Seller Dashboard</p>
        </div>
      </div>
      <div className="profile-actions">
        <button className="view-properties">View Listed Properties</button>
        <button className="upload-property">Upload Property</button>
      </div>
    </section>
  );
};

export default SellerProfileHeader;
