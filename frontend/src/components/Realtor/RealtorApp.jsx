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
import '../../styles/Realtor/RealtorApp.css';

function RealtorApp({ user, onLogout }) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [generatedLink, setGeneratedLink] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchClients();
    setGeneratedLink(`${window.location.origin}/form/${user.id}`);
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
      <Navbar 
        user={user} 
        onLogout={onLogout}
      />
      
      <div className="dashboard-content">
        <RealtorProfileHeader user={user} />

        <div className="client-form-section">
          <h2>Your Client Form</h2>
          <p>Share this link or QR code with your clients</p>
          <FormLinkGenerator 
            generatedLink={generatedLink}
            onGenerateLink={handleGenerateLink}
          />
        </div>

        <div className="clients-section">
          <h3>Clients</h3>
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
