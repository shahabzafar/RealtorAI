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
import SimpleFooter from './SimpleFooter';
import CSVImport from './CSVImport';
import ChatWidget from '../ChatWidget';
import '../../styles/Realtor/RealtorApp.css';

function RealtorApp({ user, onLogout }) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [generatedLink, setGeneratedLink] = useState('');
  const [showCsvImport, setShowCsvImport] = useState(false);
  const navigate = useNavigate();

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
    <div className="realtor-app-container">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="dashboard-content">
        <RealtorProfileHeader user={user} />

        <div className="dashboard-grid">
          <div className="dashboard-col-left">
            <div className="client-form-section">
              <div className="section-content">
                <h2>Your Client Form</h2>
                <p>Share this link or QR code with your clients to gather their information</p>
                <FormLinkGenerator
                  user={user}
                  generatedLink={generatedLink}
                  onGenerateLink={handleGenerateLink}
                />
              </div>
            </div>

            <PerformanceOverview />
          </div>

          <div className="dashboard-col-right">
            <div className="clients-section">
              <div className="section-content">
                <div className="section-header-flex">
                  <h2>Clients</h2>
                  <button
                    className="import-client-button"
                    onClick={() => setShowCsvImport(true)}
                    aria-label="Import clients"
                  >
                    +
                  </button>
                </div>
                <p>Manage your client relationships</p>

                <div className="clients-grid">
                  {clients.length > 0 ? (
                    clients.map((client) => (
                      <ClientCard
                        key={client.id}
                        client={client}
                        onSelect={setSelectedClient}
                        onPinToggle={handlePinToggle}
                      />
                    ))
                  ) : (
                    <div className="no-clients-placeholder">
                      <p>No clients yet. Import clients or share your form to get started.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <GeneratedLeads />
          </div>
        </div>

        {selectedClient && (
          <ClientDetails
            client={selectedClient}
            onClose={() => setSelectedClient(null)}
          />
        )}

        {/* CSV Import Modal */}
        <div>
          {showCsvImport && (
            <div className="modal-overlay">
              <div className="modal-container">
                <button 
                  className="modal-close-btn"
                  onClick={() => setShowCsvImport(false)}
                >
                  ✕
                </button>
                <h2>Import Clients</h2>
                <CSVImport />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <SimpleFooter />
      
      {/* ChatWidget only appears in the Realtor dashboard */}
      <ChatWidget />
    </div>
  );
}

export default RealtorApp;
