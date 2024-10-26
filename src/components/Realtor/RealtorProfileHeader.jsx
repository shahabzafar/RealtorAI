import React, { useState } from 'react';
import '../../styles/Realtor/RealtorProfileHeader.css';

const RealtorProfileHeader = () => {
  const [linkGenerated, setLinkGenerated] = useState(false);  // Manages link generation state
  const [generatedLink, setGeneratedLink] = useState('');
  const [isShareDrawerOpen, setShareDrawerOpen] = useState(false);

  const handleGenerateLink = () => {
    const newLink = 'https://example.com/generated-link';
    setGeneratedLink(newLink);
    setLinkGenerated(true);
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
