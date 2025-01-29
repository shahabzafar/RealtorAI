import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import '../../styles/Realtor/FormLinkGenerator.css';

const FormLinkGenerator = ({ user, generatedLink, onGenerateLink }) => {
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [isShareDrawerOpen, setShareDrawerOpen] = useState(false);

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
              <button className="share-option">
                <i className="fas fa-comment"></i>
                Messages
              </button>
              <button className="share-option">
                <i className="fab fa-whatsapp"></i>
                WhatsApp
              </button>
              <button className="share-option">
                <i className="fas fa-envelope"></i>
                Email
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormLinkGenerator;
