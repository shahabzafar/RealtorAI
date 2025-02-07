import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import '../../styles/Realtor/FormLinkGenerator.css';

const FormLinkGenerator = ({ user, generatedLink, onGenerateLink }) => {
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [isShareDrawerOpen, setShareDrawerOpen] = useState(false);

  const [showSocialOptions, setShowSocialOptions] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [postMessage, setPostMessage] = useState('');

  const realtorFullName = user ? `${user.firstName} ${user.lastName}` : 'Your Realtor';

  const formLink = generatedLink || `${window.location.origin}/form/${user?.id}`;

  const handleGenerateLink = () => {
    setLinkGenerated(true);
    if (onGenerateLink) {
      onGenerateLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(formLink);
    alert('Link copied to clipboard');
  };

  const toggleShareDrawer = () => {
    setShareDrawerOpen(!isShareDrawerOpen);
  };

  // When user chooses a platform
  const handleSocialClick = (platform) => {
    setShowSocialOptions(false);
    setSelectedPlatform(platform);
    // Generate a default post message
    const defaultMessage = `Hey everyone, it's ${realtorFullName}! If you or anyone you know is looking to buy or sell, please fill out my client acquisition form here: ${formLink}`;
    setPostMessage(defaultMessage);
  };

  // Show the "edit message" modal or area
  const handleOpenSocialOptions = () => {
    setShowSocialOptions(true);
  };

  const handlePostToSocial = () => {
    alert(`Posted to ${selectedPlatform} with message:\n\n${postMessage}\n\n(Real integration not implemented)`);
    // reset
    setSelectedPlatform('');
    setPostMessage('');
  };

  return (
    <div className="form-link-generator">
      {!linkGenerated ? (
        <button className="generate-link-btn" onClick={handleGenerateLink}>
          Generate Client Form Link
        </button>
      ) : (
        <div className="generated-link-content">
          <div className="link-qr-container">
            <div className="link-section">
              <h3>Share Your Client Form</h3>
              <div className="link-display">
                <input type="text" value={formLink} readOnly />
                <div className="link-actions">
                  <button className="copy-btn" onClick={handleCopyLink}>
                    Copy Link
                  </button>
                  <button className="share-btn" onClick={toggleShareDrawer}>
                    Share
                  </button>
                </div>
              </div>
            </div>
            <div className="qr-section">
              <QRCodeSVG value={formLink} size={128} />
              <p>Scan QR Code</p>
            </div>
          </div>

          {isShareDrawerOpen && (
            <div className="share-drawer">
              <button className="share-option" onClick={() => handleSocialClick('Facebook')}>
                <i className="fab fa-facebook"></i> Facebook
              </button>
              <button className="share-option" onClick={() => handleSocialClick('Instagram')}>
                <i className="fab fa-instagram"></i> Instagram
              </button>
              <button className="share-option" onClick={() => handleSocialClick('LinkedIn')}>
                <i className="fab fa-linkedin"></i> LinkedIn
              </button>
            </div>
          )}

          {/* Simple modal or inline box to allow user editing the message */}
          {selectedPlatform && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#f5f5f5',
              borderRadius: '8px'
            }}>
              <h4>Preview your post for {selectedPlatform}:</h4>
              <textarea
                style={{ width: '100%', height: '100px' }}
                value={postMessage}
                onChange={(e) => setPostMessage(e.target.value)}
              />
              <div style={{ marginTop: '1rem' }}>
                <button onClick={handlePostToSocial}>Post</button>
                <button style={{ marginLeft: '1rem' }} onClick={() => {
                  setSelectedPlatform('');
                  setPostMessage('');
                }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormLinkGenerator;
