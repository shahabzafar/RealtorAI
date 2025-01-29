import React, { useState, useEffect } from 'react';
import '../../styles/Realtor/GeneratedLeads.css';

const GeneratedLeads = () => {
  const [leads, setLeads] = useState({
    sellers: [],
    buyers: []
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const getLeads = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/clients`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json'
        }
      });

      if (response.ok) {
        const clients = await response.json();
        // Group clients by type
        setLeads({
          sellers: clients.filter((client) => client.client_type === 'seller'),
          buyers: clients.filter((client) => client.client_type === 'buyer')
        });
      } else {
        console.error('Failed to fetch leads:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  useEffect(() => {
    getLeads();
    // Optionally fetch every 30 seconds
    const intervalId = setInterval(getLeads, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const LeadCard = ({ client }) => (
    <div className="lead-card">
      <div className="lead-header">
        <h4>
          {client.first_name} {client.last_name}
        </h4>
        <div className="lead-contact">
          <p>
            <i className="fas fa-phone"></i> {client.phone}
          </p>
          <p>
            <i className="fas fa-envelope"></i> {client.email}
          </p>
        </div>
      </div>
      <div className="lead-details">
        {client.client_type === 'buyer' ? (
          <>
            <p>
              <strong>Budget:</strong> ${client.budget}
            </p>
            <p>
              <strong>Location:</strong> {client.location}
            </p>
            <p>
              <strong>Amenities:</strong> {client.amenities}
            </p>
          </>
        ) : (
          <>
            <p>
              <strong>Notes:</strong> {client.notes}
            </p>
            {client.property_images && (
              <div className="property-images">
                {client.property_images.map((url, idx) => (
                  <img key={idx} src={url} alt={`Property ${idx + 1}`} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <section className="generated-leads">
      <div className="leads-header">
        <h2>Client Leads</h2>
        <p>All your client inquiries in one place</p>
      </div>

      <div className="leads-grid">
        <div className="leads-column">
          <div className="leads-section-header">
            <h3>Seller Clients</h3>
            <span className="lead-count">{leads.sellers.length} clients</span>
          </div>
          <div className="leads-list">
            {leads.sellers.length > 0 ? (
              leads.sellers.map((client) => <LeadCard key={client.id} client={client} />)
            ) : (
              <div className="no-leads">No seller clients yet</div>
            )}
          </div>
        </div>

        <div className="leads-column">
          <div className="leads-section-header">
            <h3>Buyer Clients</h3>
            <span className="lead-count">{leads.buyers.length} clients</span>
          </div>
          <div className="leads-list">
            {leads.buyers.length > 0 ? (
              leads.buyers.map((client) => <LeadCard key={client.id} client={client} />)
            ) : (
              <div className="no-leads">No buyer clients yet</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneratedLeads;
