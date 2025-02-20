import React from 'react';
import '../../styles/Realtor/ClientCard.css';

const ClientCard = ({ client, onSelect }) => {
  return (
    <div className="client-card">
      <div className="client-header">
        <strong>
          {client.first_name} {client.last_name}
        </strong>
      </div>
      <div onClick={() => onSelect(client)} className="client-body">
        <p>{client.client_type === 'seller' ? 'Seller' : 'Buyer'}</p>
        <p>Created: {new Date(client.created_at).toLocaleString()}</p>
      </div>
      <div className="floating-import-button" onClick={() => onSelect(client)} />
    </div>
  );
};

export default ClientCard; 