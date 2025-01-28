import React from 'react';
import '../../styles/Realtor/RealtorProfileHeader.css';

const RealtorProfileHeader = ({ user }) => {
  return (
    <section className="realtor-profile-header">
      <div className="profile-info">
        <div className="profile-image">
          <div className="circle-placeholder"></div>
        </div>
        <div className="profile-text">
          <h2>{user ? `${user.firstName} ${user.lastName}` : 'User Name'}</h2>
          <div className="badge">Top Realtor</div>
          <p>Welcome to your Realtor Dashboard</p>
        </div>
      </div>
    </section>
  );
};

export default RealtorProfileHeader;
