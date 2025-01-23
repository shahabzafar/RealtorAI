import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Realtor/RealtorProfileHeader.css';

const RealtorProfileHeader = ({ user }) => {
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [isShareDrawerOpen, setShareDrawerOpen] = useState(false);

  const handleGenerateLink = async () => {
    try {
      // Reset link state before generating a new one
      setGeneratedLink('');
      setLinkGenerated(false);
  
      const response = await axios.post('/generate-link', {
        realtorId: user.id,
      });
  
      const data = response.data;
      console.log('Response from backend:', data);
  
      if (data.link) {
        setGeneratedLink(data.link);
        setLinkGenerated(true);
      } else {
        console.error('Error: No link returned from backend');
        // Set the default link
        setGeneratedLink('https://form-interface-ee593b.zapier.app/');
        setLinkGenerated(true);
      }
    } catch (error) {
      console.error('Error generating link:', error);
      // Set the default link in case of error
      setGeneratedLink('https://form-interface-ee593b.zapier.app/');
      setLinkGenerated(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    alert('Link copied to clipboard');
  };

  const toggleShareDrawer = () => {
    setShareDrawerOpen(!isShareDrawerOpen);
  };

  return (
    <section className="realtor-profile-header">
      <div className="profile-info">
        <div className="profile-image">
          <div className="circle-placeholder"></div>
        </div>
        <div className="profile-text">
          <h2>{user ? `${user.firstName} ${user.lastName}` : 'User Name'}</h2>
          <div className="badge">Top Realtor</div>
          <p>Welcome to your Realtor Dashboard</p>
        </div>
      </div>

      <div className="profile-actions">
        {linkGenerated ? (
          <div className="generated-link-box">
            <span className="generated-link">{generatedLink}</span>
            <button className="copy-link" onClick={handleCopyLink}>
              Copy Link
            </button>
            <button className="share-link" onClick={toggleShareDrawer}>
              Share
            </button>
          </div>
        ) : (
          <button className="generate-link" onClick={handleGenerateLink}>
            Generate Link
          </button>
        )}

        {isShareDrawerOpen && (
          <div className="share-drawer">
            <button className="share-option">Messages</button>
            <button className="share-option">WhatsApp</button>
            <button className="share-option">Email</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RealtorProfileHeader;
