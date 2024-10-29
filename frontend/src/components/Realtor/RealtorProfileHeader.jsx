import React, { useState } from 'react';
import '../../styles/Realtor/RealtorProfileHeader.css';

const RealtorProfileHeader = () => {
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [isShareDrawerOpen, setShareDrawerOpen] = useState(false);

  const handleGenerateLink = async () => {
    try {
      // Reset link state before generating a new one
      setGeneratedLink('');
      setLinkGenerated(false);

      const response = await fetch('http://localhost:5000/generate-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ realtorId: "realtor123" }) // Adjust realtorId as needed
      });

      const data = await response.json();
      console.log("Response from backend:", data);

      if (data.link) {
        setGeneratedLink(data.link);
        setLinkGenerated(true);
      } else {
        console.error('Error: No link returned from backend');
      }
    } catch (error) {
      console.error('Error generating link:', error);
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
          <h2>User name (Realtor Profile)</h2>
          <div className="badge">Top Realtor</div>
          <p>Welcome to your Realtor Dashboard</p>
        </div>
      </div>
      
      <div className="profile-actions">
        {linkGenerated ? (
          <div className="generated-link-box">
            <span className="generated-link">{generatedLink}</span>
            <button className="copy-link" onClick={handleCopyLink}>Copy Link</button>
            <button className="share-link" onClick={toggleShareDrawer}>Share</button>
          </div>
        ) : (
          <button className="generate-link" onClick={handleGenerateLink}>Generate Link</button>
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
