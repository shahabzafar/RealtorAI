import React, { useState, useEffect, useRef } from 'react';
import '../../styles/Realtor/AiChat.css';

const AiChat = () => {
  const [showChat, setShowChat] = useState(false);
  const landbotInstanceRef = useRef(null);

  useEffect(() => {
    if (!landbotInstanceRef.current && showChat) {
      const loadLandbot = () => {
        try {
          landbotInstanceRef.current = new window.Landbot.Container({
            container: '#myLandbot',
            configUrl: 'https://storage.googleapis.com/landbot.online/v3/H-2677681-SQEQ6FI3JEY1LKYE/index.json',
          });
        } catch (error) {
          console.error('Error initializing Landbot:', error);
        }
      };

      if (window.Landbot) {
        loadLandbot();
      } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.landbot.io/landbot-3/landbot-3.0.0.js';
        script.async = true;
        script.onload = loadLandbot;
        document.body.appendChild(script);
      }
    }
  }, [showChat]);

  const handleClose = () => {
    try {
      // Simply remove the container's content and reset the ref
      const container = document.getElementById('myLandbot');
      if (container) {
        container.innerHTML = '';
      }
      landbotInstanceRef.current = null;
      setShowChat(false);
    } catch (error) {
      console.error('Error closing chat:', error);
      // Ensure the state is updated even if there's an error
      setShowChat(false);
    }
  };

  return (
    <section className={`ai-chat-section ${showChat ? 'expanded' : ''}`}>
      {showChat && (
        <button 
          className="close-chat-button" 
          onClick={handleClose}
          aria-label="Close chat"
        >
          ×
        </button>
      )}
      {!showChat ? (
        <div className="ai-chat-initial">
          <h3>Talk to our AI Agent</h3>
          <button onClick={() => setShowChat(true)}>Start Chat</button>
        </div>
      ) : (
        <div id="myLandbot" className="landbot-container"></div>
      )}
    </section>
  );
};

export default AiChat;
