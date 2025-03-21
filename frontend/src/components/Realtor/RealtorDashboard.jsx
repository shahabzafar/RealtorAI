import React from 'react';
import RealtorProfileHeader from './RealtorProfileHeader';
import ClientsGrid from './ClientsGrid';
import ClientLeads from './ClientLeads';
import PerformanceOverview from './PerformanceOverview';
import '../../styles/Realtor/RealtorDashboard.css';

const RealtorDashboard = ({ user }) => {
  return (
    <div className="realtor-dashboard">
      <RealtorProfileHeader user={user} />
      
      <div className="dashboard-grid">
        <div className="dashboard-col-left">
          <ClientsGrid />
          <ClientLeads />
        </div>
        
        <div className="dashboard-col-right">
          <PerformanceOverview />
        </div>
      </div>
    </div>
  );
};

export default RealtorDashboard; 