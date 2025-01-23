import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react'; // install via `npm install qrcode.react`
import { useNavigate } from 'react-router-dom';

import '../../styles/Realtor/global.css'; // or your dark mode
import '../../styles/MainPage/MainPage.css'; // custom styling for the main page

function MainPage({ user, onLogout }) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [generatedLink, setGeneratedLink] = useState('');

  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      const res = await axios.get('/api/clients');
      setClients(res.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const handlePinToggle = async (clientId, pinned) => {
    try {
      await axios.put(`/api/clients/${clientId}/pin`, { pinned: !pinned });
      // re-fetch
      fetchClients();
    } catch (err) {
      console.error('Error pinning/unpinning client:', err);
    }
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
  };

  // Generate the link or you can just do setGeneratedLink to front-end route
  const handleGenerateLink = async () => {
    try {
      const res = await axios.post('/generate-link');
      if (res.data && res.data.link) {
        setGeneratedLink(res.data.link);
      } else {
        // fallback
        setGeneratedLink(`${window.location.origin}/form/${user.id}`);
      }
    } catch (error) {
      console.error('Error generating link:', error);
      setGeneratedLink(`${window.location.origin}/form/${user.id}`);
    }
  };

  useEffect(() => {
    fetchClients();
    // Default link
    setGeneratedLink(`${window.location.origin}/form/${user.id}`);
  }, [user]);

  const handleLogoutClick = () => {
    onLogout();
  };

  return (
    <div className="main-page-container dark-mode"> 
      {/* Example: add a "dark-mode" class or scss variable */}
      <header className="main-page-header">
        <h2>Welcome, {user ? `${user.firstName} ${user.lastName}` : 'Realtor'}</h2>
        <div className="header-actions">
          <button onClick={() => navigate('/settings')}>Settings</button>
          <button onClick={handleLogoutClick}>Logout</button>
        </div>
      </header>

      <div className="form-link-section">
        <h3>Your Client Form</h3>
        <p>Share this link or QR code with your clients</p>
        <div className="form-link-container">
          <input
            type="text"
            value={generatedLink}
            readOnly
          />
          <button onClick={handleGenerateLink}>Generate Link</button>
        </div>
        <div className="qr-code-container">
            <QRCodeSVG value={generatedLink} size={128} />
        </div>
      </div>

      <div className="clients-section">
        <h3>Clients</h3>
        <div className="clients-grid">
          {clients.map((client) => (
            <div key={client.id} className="client-card">
              <div className="client-header">
                <strong>
                  {client.first_name} {client.last_name}
                </strong>
                <button
                  className="pin-button"
                  onClick={() => handlePinToggle(client.id, client.pinned)}
                >
                  {client.pinned ? 'Unpin' : 'Pin'}
                </button>
              </div>
              <div onClick={() => handleSelectClient(client)} className="client-body">
                <p>{client.client_type === 'seller' ? 'Seller' : 'Buyer'}</p>
                <p>Created: {new Date(client.created_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* If a client is selected, show detail pop-up or side panel */}
        {selectedClient && (
          <div className="client-detail">
            <h4>
              {selectedClient.first_name} {selectedClient.last_name}{' '}
              ({selectedClient.client_type})
            </h4>
            <p>Phone: {selectedClient.phone}</p>
            <p>Email: {selectedClient.email}</p>
            {selectedClient.client_type === 'seller' && (
              <>
                <p>Notes: {selectedClient.notes}</p>
                {selectedClient.property_images && selectedClient.property_images.length > 0 && (
                  <div className="property-images">
                    {selectedClient.property_images.map((url, idx) => (
                      <img src={url} alt={`property-${idx}`} key={idx} />
                    ))}
                  </div>
                )}
              </>
            )}
            {selectedClient.client_type === 'buyer' && (
              <>
                <p>Budget: {selectedClient.budget}</p>
                <p>Location: {selectedClient.location}</p>
                <p>Amenities: {selectedClient.amenities}</p>
              </>
            )}
            <button onClick={() => setSelectedClient(null)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;
