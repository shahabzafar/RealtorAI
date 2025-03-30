import React, { useState, useCallback, memo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';
import '../../styles/Realtor/FormLinkGenerator.css';

const ShareOverlay = memo(({ onClose, onSocialClick, selectedPlatform, postMessage, onPostMessage, onPost }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return createPortal(
    <div 
      className="share-overlay" 
      onClick={onClose}
      onMouseMove={(e) => e.stopPropagation()}
    >
      <div 
        className="share-overlay-content" 
        onClick={(e) => e.stopPropagation()}
        onMouseMove={(e) => e.stopPropagation()}
      >
        <div className="overlay-header">
          <h4>Choose a platform</h4>
          <button className="close-overlay-button" onClick={onClose}>✕</button>
        </div>
        <div className="social-buttons">
          <button className="share-option" data-platform="Facebook" onClick={() => onSocialClick('Facebook')}>
            <i className="fab fa-facebook"></i> Facebook
          </button>
          <button className="share-option" data-platform="Instagram" onClick={() => onSocialClick('Instagram')}>
            <i className="fab fa-instagram"></i> Instagram
          </button>
          <button className="share-option" data-platform="LinkedIn" onClick={() => onSocialClick('LinkedIn')}>
            <i className="fab fa-linkedin"></i> LinkedIn
          </button>
        </div>
        {selectedPlatform && (
          <div className="message-editor">
            <h5>Preview your post for {selectedPlatform}:</h5>
            <textarea 
              value={postMessage} 
              onChange={e => onPostMessage(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
            <div className="post-buttons">
              <button onClick={onPost}>Post</button>
              <button onClick={() => onSocialClick('')}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
});

const FormLinkGenerator = ({ user, generatedLink, onGenerateLink }) => {
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [isShareOverlayOpen, setIsShareOverlayOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [postMessage, setPostMessage] = useState('');

  const realtorFullName = user ? `${user.firstName} ${user.lastName}` : 'Your Realtor';
  const formLink = generatedLink || `${window.location.origin}/form/${user?.id}`;

  const handleGenerateLink = useCallback(() => {
    setLinkGenerated(true);
    if (onGenerateLink) {
      onGenerateLink();
    }
  }, [onGenerateLink]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(formLink);
    alert('Link copied to clipboard');
  }, [formLink]);

  const toggleShareOverlay = useCallback(() => {
    setIsShareOverlayOpen(prev => !prev);
    if (isShareOverlayOpen) {
      setSelectedPlatform('');
      setPostMessage('');
    }
  }, [isShareOverlayOpen]);

  const handleSocialClick = useCallback((platform) => {
    setSelectedPlatform(platform);
    if (platform) {
      const defaultMessage = `Hey everyone, it's ${realtorFullName}! If you or anyone you know is looking to buy or sell, please fill out my client acquisition form here: ${formLink}`;
      setPostMessage(defaultMessage);
    }
  }, [realtorFullName, formLink]);

  const handlePostToSocial = useCallback(() => {
    let shareUrl = '';
    
    switch(selectedPlatform) {
      case 'Facebook':
        navigator.clipboard.writeText(postMessage);
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(formLink)}`;
        alert('Message copied to clipboard! Please paste it in your Facebook post.');
        break;
      
      case 'Instagram':
        navigator.clipboard.writeText(postMessage);
        shareUrl = 'https://instagram.com';
        alert('Message copied to clipboard! Please paste it in your Instagram post.');
        break;
      
      case 'LinkedIn':
        const linkedInText = `${postMessage}\n\nFill out the form here: ${formLink}`;
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(formLink)}&title=${encodeURIComponent('Client Acquisition Form')}&text=${encodeURIComponent(linkedInText)}&source=${encodeURIComponent(window.location.origin)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=600,scrollbars=yes');
    }

    setSelectedPlatform('');
    setPostMessage('');
    toggleShareOverlay();
  }, [selectedPlatform, postMessage, formLink, toggleShareOverlay]);

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
                  <button className="copy-btn" onClick={handleCopyLink}>Copy Link</button>
                  <button className="share-btn" onClick={toggleShareOverlay}>Share</button>
                </div>
              </div>
            </div>
            <div className="qr-section">
              <QRCodeSVG value={formLink} size={128} />
              <p>Scan QR Code</p>
            </div>
          </div>

          {isShareOverlayOpen && (
            <ShareOverlay
              onClose={toggleShareOverlay}
              onSocialClick={handleSocialClick}
              selectedPlatform={selectedPlatform}
              postMessage={postMessage}
              onPostMessage={setPostMessage}
              onPost={handlePostToSocial}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default memo(FormLinkGenerator);
