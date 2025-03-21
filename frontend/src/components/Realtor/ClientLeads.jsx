import React, { useState } from 'react';
import '../../styles/Realtor/ClientLeads.css';

const ClientLeads = () => {
  // Sample data for illustration
  const sellerClients = [
    { id: 1, name: 'Emma Johnson', property: '123 Main St', price: '$420,000', status: 'New Lead' },
    { id: 2, name: 'Michael Smith', property: '456 Oak Ave', price: '$350,000', status: 'Follow Up' },
    { id: 3, name: 'Sarah Wilson', property: '789 Pine Blvd', price: '$500,000', status: 'Negotiating' },
    { id: 4, name: 'David Brown', property: '321 Cedar Ln', price: '$280,000', status: 'New Lead' },
  ];

  const buyerClients = [
    { id: 1, name: 'Jessica Miller', budget: '$350,000', area: 'Downtown', status: 'New Lead' },
    { id: 2, name: 'John Davis', budget: '$450,000', area: 'Suburb', status: 'Viewing' },
    { id: 3, name: 'Lisa Garcia', budget: '$500,000', area: 'Beachside', status: 'Negotiating' },
    { id: 4, name: 'Robert Wilson', budget: '$380,000', area: 'Westside', status: 'New Lead' },
  ];

  const [sellerExpanded, setSellerExpanded] = useState(false);
  const [buyerExpanded, setBuyerExpanded] = useState(false);

  return (
    <section className="client-leads">
      <h2>Client Leads</h2>
      <p>All your client inquiries in one place</p>
      
      <div className="leads-container">
        <div className="leads-section">
          <div className="leads-header">
            <h3>Seller Clients</h3>
            <div className="leads-actions">
              <span className="leads-count">{sellerClients.length} clients</span>
              <button 
                className="expand-leads" 
                onClick={() => setSellerExpanded(!sellerExpanded)}
              >
                {sellerExpanded ? 'Show Less' : 'View All'}
              </button>
            </div>
          </div>
          
          <div className={`leads-scroll-container ${sellerExpanded ? 'expanded' : ''}`}>
            {sellerClients.length > 0 ? (
              <div className="leads-scroll">
                {sellerClients.map(client => (
                  <div key={client.id} className="lead-card seller-card">
                    <div className="lead-card-header">
                      <h4>{client.name}</h4>
                      <span className="lead-status">{client.status}</span>
                    </div>
                    <div className="lead-details">
                      <div className="lead-detail">
                        <span className="detail-label">Property:</span>
                        <span className="detail-value">{client.property}</span>
                      </div>
                      <div className="lead-detail">
                        <span className="detail-label">Listing Price:</span>
                        <span className="detail-value">{client.price}</span>
                      </div>
                    </div>
                    <button className="contact-lead">Contact</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-leads">
                <p>No seller clients yet</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="leads-section">
          <div className="leads-header">
            <h3>Buyer Clients</h3>
            <div className="leads-actions">
              <span className="leads-count">{buyerClients.length} clients</span>
              <button 
                className="expand-leads" 
                onClick={() => setBuyerExpanded(!buyerExpanded)}
              >
                {buyerExpanded ? 'Show Less' : 'View All'}
              </button>
            </div>
          </div>
          
          <div className={`leads-scroll-container ${buyerExpanded ? 'expanded' : ''}`}>
            {buyerClients.length > 0 ? (
              <div className="leads-scroll">
                {buyerClients.map(client => (
                  <div key={client.id} className="lead-card buyer-card">
                    <div className="lead-card-header">
                      <h4>{client.name}</h4>
                      <span className="lead-status">{client.status}</span>
                    </div>
                    <div className="lead-details">
                      <div className="lead-detail">
                        <span className="detail-label">Budget:</span>
                        <span className="detail-value">{client.budget}</span>
                      </div>
                      <div className="lead-detail">
                        <span className="detail-label">Preferred Area:</span>
                        <span className="detail-value">{client.area}</span>
                      </div>
                    </div>
                    <button className="contact-lead">Contact</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-leads">
                <p>No buyer clients yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientLeads; 