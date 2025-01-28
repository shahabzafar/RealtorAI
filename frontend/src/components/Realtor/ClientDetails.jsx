import React from 'react';
import '../../styles/Realtor/ClientDetails.css';

const ClientDetails = ({ client, onClose }) => {
  return (
    <div className="client-detail">
      <h4>
        {client.first_name} {client.last_name} ({client.client_type})
      </h4>
      <p>Phone: {client.phone}</p>
      <p>Email: {client.email}</p>
      {client.client_type === 'seller' && (
        <>
          <p>Notes: {client.notes}</p>
          {client.property_images && client.property_images.length > 0 && (
            <div className="property-images">
              {client.property_images.map((url, idx) => (
                <img src={url} alt={`property-${idx}`} key={idx} />
              ))}
            </div>
          )}
        </>
      )}
      {client.client_type === 'buyer' && (
        <>
          <p>Budget: {client.budget}</p>
          <p>Location: {client.location}</p>
          <p>Amenities: {client.amenities}</p>
        </>
      )}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ClientDetails; 