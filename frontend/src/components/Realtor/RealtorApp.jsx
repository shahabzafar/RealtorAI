import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar';
import ClientCard from './ClientCard';
import ClientDetails from './ClientDetails';
import FormLinkGenerator from './FormLinkGenerator';
import PerformanceOverview from './PerformanceOverview';
import GeneratedLeads from './GeneratedLeads';
import RealtorProfileHeader from './RealtorProfileHeader';
import Footer from '../Home/Footer';
import Carousel from './Carousel';
import AiChat from './AiChat';
import CSVImport from './CSVImport';
import '../../styles/Realtor/RealtorApp.css';

function RealtorApp({ user, onLogout }) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const [generatedLink, setGeneratedLink] = useState('');
  const navigate = useNavigate();

  // For showing/hiding CSV Import modal
  const [showCsvImport, setShowCsvImport] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchClients();

    // By default, set a local generated link
    if (user.id) {
      setGeneratedLink(`${window.location.origin}/form/${user.id}`);
    }
  }, [user, navigate]);

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
      fetchClients();
    } catch (err) {
      console.error('Error pinning/unpinning client:', err);
    }
  };

  const handleGenerateLink = async () => {
    try {
      const res = await axios.post('/generate-link');
      if (res.data && res.data.link) {
        setGeneratedLink(res.data.link);
      }
    } catch (error) {
      console.error('Error generating link:', error);
    }
  };

  return (
    <div className="realtor-app-container dark-mode">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="dashboard-content">
        <RealtorProfileHeader user={user} />

        <div className="client-form-section">
          <h2>Your Client Form</h2>
          <p>Share this link or QR code with your clients</p>
          <FormLinkGenerator
            user={user}
            generatedLink={generatedLink}
            onGenerateLink={handleGenerateLink}
          />
        </div>

        <div className="clients-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3>Clients</h3>
            <button
              style={{
                backgroundColor: '#3f51b5',
                color: 'white',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => setShowCsvImport(true)}
            >
              {/* If you have Font Awesome loaded, use an icon: */}
              <i className="fas fa-plus" style={{ fontSize: '18px' }}></i>
              
              {/* Otherwise, you can do plain text:
              + 
              */}
            </button>
          </div>

          <div className="clients-grid">
            {clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onSelect={setSelectedClient}
                onPinToggle={handlePinToggle}
              />
            ))}
          </div>

          {selectedClient && (
            <ClientDetails
              client={selectedClient}
              onClose={() => setSelectedClient(null)}
            />
          )}

          {/* Our overlay for CSV import */}
          {showCsvImport && (
            <div
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div
                style={{
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '1rem',
                  width: '600px',
                  maxWidth: '90%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  position: 'relative'
                }}
              >
                <button
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                  }}
                  onClick={() => setShowCsvImport(false)}
                >
                  ✕
                </button>
                <CSVImport />
              </div>
            </div>
          )}
        </div>

        <PerformanceOverview />
        <GeneratedLeads />

        <div className="ai-chat-container">
          <AiChat />
        </div>
        <Carousel />
      </div>

      <Footer />
    </div>
  );
}

export default RealtorApp;
