import React, { useState } from 'react';
import '../../styles/Realtor/GeneratedLeads.css';

const GeneratedLeads = () => {
  const userName = 'Jaydeep'; // Dynamic user name placeholder

  const buyerLeads = [
    { fullName: 'John Doe', phone: '555-1234', area: 'Downtown', budget: '$300,000' },
    { fullName: 'Jane Smith', phone: '555-5678', area: 'Uptown', budget: '$400,000' },
    { fullName: 'Mike Johnson', phone: '555-9101', area: 'Suburbs', budget: '$250,000' },
    // Additional buyer leads can be added here
  ];

  const sellerLeads = [
    { fullName: 'Sara Lee', phone: '555-2233', area: 'Riverside', sellingPrice: '$500,000' },
    { fullName: 'Tom Hanks', phone: '555-3344', area: 'City Center', sellingPrice: '$600,000' },
    { fullName: 'Chris Evans', phone: '555-4455', area: 'Hilltop', sellingPrice: '$700,000' },
    // Additional seller leads can be added here
  ];

  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);

  return (
    <section className="generated-leads">
      <h1 className="leads-title">Hey {userName}, your potential leads at a glance</h1>

      <div className="leads-container">
        <div className="buyer-leads">
          <h2>Buyer Leads</h2>
          <div className="leads-grid">
            {buyerLeads.slice(0, 3).map((lead, index) => (
              <div key={index} className="lead-card">
                <div className="user-image"></div>
                <div className="lead-info">
                  <div className="lead-info-section">
                    <p><strong>Full Name:</strong> {lead.fullName}</p>
                    <p><strong>Phone Number:</strong> {lead.phone}</p>
                  </div>
                  <div className="lead-info-section">
                    <p><strong>Area:</strong> {lead.area}</p>
                    <p className="bold"><strong>Budget:</strong> {lead.budget}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="see-all" onClick={() => setShowBuyerModal(true)}>See All</p>
        </div>

        <div className="seller-leads">
          <h2>Seller Leads</h2>
          <div className="leads-grid">
            {sellerLeads.slice(0, 3).map((lead, index) => (
              <div key={index} className="lead-card">
                <div className="user-image"></div>
                <div className="lead-info">
                  <div className="lead-info-section">
                    <p><strong>Full Name:</strong> {lead.fullName}</p>
                    <p><strong>Phone Number:</strong> {lead.phone}</p>
                  </div>
                  <div className="lead-info-section">
                    <p><strong>Area:</strong> {lead.area}</p>
                    <p className="bold"><strong>Selling Price:</strong> {lead.sellingPrice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="see-all" onClick={() => setShowSellerModal(true)}>See All</p>
        </div>
      </div>

      {/* Buyer Modal */}
      {showBuyerModal && (
        <div className="modal-overlay" onClick={() => setShowBuyerModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>All Buyer Leads</h2>
            <div className="modal-leads-grid">
              {buyerLeads.map((lead, index) => (
                <div key={index} className="lead-card">
                  <div className="user-image"></div>
                  <div className="lead-info">
                    <p><strong>Full Name:</strong> {lead.fullName}</p>
                    <p><strong>Phone Number:</strong> {lead.phone}</p>
                    <p><strong>Area:</strong> {lead.area}</p>
                    <p className="bold"><strong>Budget:</strong> {lead.budget}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Seller Modal */}
      {showSellerModal && (
        <div className="modal-overlay" onClick={() => setShowSellerModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>All Seller Leads</h2>
            <div className="modal-leads-grid">
              {sellerLeads.map((lead, index) => (
                <div key={index} className="lead-card">
                  <div className="user-image"></div>
                  <div className="lead-info">
                    <p><strong>Full Name:</strong> {lead.fullName}</p>
                    <p><strong>Phone Number:</strong> {lead.phone}</p>
                    <p><strong>Area:</strong> {lead.area}</p>
                    <p className="bold"><strong>Selling Price:</strong> {lead.sellingPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GeneratedLeads;
