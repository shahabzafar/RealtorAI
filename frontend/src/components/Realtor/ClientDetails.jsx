import React from 'react';
import '../../styles/Realtor/ClientDetails.css';

const ClientDetails = ({ client, onClose }) => {
  return (
    <div className="client-details-overlay">
      <div className="client-details-container">
        <button className="close-details-btn" onClick={onClose}>
          ✕
        </button>
        
        <div className="client-details-header">
          <h2>{client.first_name} {client.last_name}</h2>
          <span className="client-type-badge">
            {client.client_type === 'seller' ? 'Seller' : 'Buyer'}
          </span>
        </div>
        
        <div className="client-details-content">
          <div className="client-details-section">
            <h3>Contact Information</h3>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{client.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{client.phone}</span>
            </div>
          </div>
          
          {client.client_type === 'buyer' ? (
            <div className="client-details-section">
              <h3>Buyer Preferences</h3>
              <div className="detail-row">
                <span className="detail-label">Budget:</span>
                <span className="detail-value">${client.budget}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{client.location}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Amenities:</span>
                <span className="detail-value">{client.amenities || 'None specified'}</span>
              </div>
            </div>
          ) : (
            <div className="client-details-section">
              <h3>Seller Information</h3>
              <div className="detail-row">
                <span className="detail-label">Property Address:</span>
                <span className="detail-value">{client.property_address || 'Not specified'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Property Type:</span>
                <span className="detail-value">{client.property_type || 'Not specified'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Asking Price:</span>
                <span className="detail-value">${client.asking_price || 'Not specified'}</span>
              </div>
            </div>
          )}
          
          <div className="client-details-section">
            <h3>Additional Notes</h3>
            <p className="client-notes">{client.notes || 'No additional notes.'}</p>
          </div>
          
          <div className="client-details-footer">
            <button className="details-action-btn primary">Contact Client</button>
            <button className="details-action-btn secondary">Edit Details</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails; 