import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import '../../styles/Realtor/FormLinkGenerator.css';

const FormLinkGenerator = ({ user, generatedLink, onGenerateLink }) => {
  const [linkGenerated, setLinkGenerated] = useState(false);

  // isShareOverlayOpen replaces isShareDrawerOpen to show an overlay
  const [isShareOverlayOpen, setIsShareOverlayOpen] = useState(false);

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

  // Open or close the overlay
  const toggleShareOverlay = () => {
    setIsShareOverlayOpen(!isShareOverlayOpen);
    // reset any existing selectedPlatform
    if (isShareOverlayOpen) {
      setSelectedPlatform('');
      setPostMessage('');
    }
  };

  // When user chooses a platform
  const handleSocialClick = (platform) => {
    setSelectedPlatform(platform);
    // Generate a default post message
    const defaultMessage = `Hey everyone, it's ${realtorFullName}! If you or anyone you know is looking to buy or sell, please fill out my client acquisition form here: ${formLink}`;
    setPostMessage(defaultMessage);
  };

  // Post to social (in reality, you'd integrate actual share APIs)
  const handlePostToSocial = () => {
    alert(`Posted to ${selectedPlatform} with message:\n\n${postMessage}\n\n(Real integration not implemented)`);
    // reset
    setSelectedPlatform('');
    setPostMessage('');
    toggleShareOverlay();
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
                  <button className="share-btn" onClick={toggleShareOverlay}>
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

          {/* Overlay for social sharing */}
          {isShareOverlayOpen && (
            <div className="share-overlay">
              <div className="share-overlay-content">
                <div className="overlay-header">
                  <h4>Choose a platform</h4>
                  <button className="close-overlay-button" onClick={toggleShareOverlay}>
                    ✕
                  </button>
                </div>
                <div className="social-buttons">
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

                {/* If a platform is selected, show message editor */}
                {selectedPlatform && (
                  <div className="message-editor">
                    <h5>Preview your post for {selectedPlatform}:</h5>
                    <textarea
                      value={postMessage}
                      onChange={(e) => setPostMessage(e.target.value)}
                    />
                    <div className="post-buttons">
                      <button onClick={handlePostToSocial}>Post</button>
                      <button onClick={() => setSelectedPlatform('')}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormLinkGenerator;
