import React from 'react';
import '../../styles/Realtor/ClientsGrid.css';

const ClientsGrid = () => {
  // Sample clients data
  const clients = [
    { id: 1, name: 'John Smith', type: 'Buyer', status: 'Active', dateAdded: '04/15/2023' },
    { id: 2, name: 'Sarah Johnson', type: 'Seller', status: 'Active', dateAdded: '05/22/2023' },
    { id: 3, name: 'Michael Brown', type: 'Buyer', status: 'Inactive', dateAdded: '02/10/2023' },
    { id: 4, name: 'Emily Davis', type: 'Seller', status: 'Active', dateAdded: '06/05/2023' },
    { id: 5, name: 'David Wilson', type: 'Buyer', status: 'Active', dateAdded: '03/18/2023' },
    { id: 6, name: 'Jessica Taylor', type: 'Seller', status: 'Inactive', dateAdded: '01/27/2023' },
    { id: 7, name: 'Daniel Martinez', type: 'Buyer', status: 'Active', dateAdded: '07/12/2023' },
    { id: 8, name: 'Laura Anderson', type: 'Seller', status: 'Active', dateAdded: '05/30/2023' },
  ];

  return (
    <section className="clients-grid">
      <div className="clients-header">
        <div>
          <h2>Clients</h2>
          <p>Manage your client relationships</p>
        </div>
        <div className="add-client-button">
          <button><i className="plus-icon">+</i> Add Client</button>
        </div>
      </div>

      {clients.length > 0 ? (
        <div className="clients-scroll-container">
          <div className="clients-scroll">
            {clients.map(client => (
              <div key={client.id} className={`client-card ${client.type.toLowerCase()}-client`}>
                <div className="client-type-badge">{client.type}</div>
                <div className="client-info">
                  <h3>{client.name}</h3>
                  <span className={`client-status ${client.status.toLowerCase()}-status`}>
                    {client.status}
                  </span>
                </div>
                <div className="client-date">
                  <span>Added: {client.dateAdded}</span>
                </div>
                <div className="client-actions">
                  <button className="view-client">View Details</button>
                  <button className="contact-client">Contact</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-clients-placeholder">
          <p>No clients yet. Import clients or share your form to get started.</p>
        </div>
      )}
    </section>
  );
};

export default ClientsGrid; 