import React, { useState, useEffect, useRef } from 'react';
import '../../styles/Realtor/AiChat.css';

const AiChat = () => {
  const [showChat, setShowChat] = useState(false); // State for chat visibility
  const landbotInstanceRef = useRef(null);

  useEffect(() => {
    if (!landbotInstanceRef.current && showChat) {
      const loadLandbot = () => {
        landbotInstanceRef.current = new window.Landbot.Container({
          container: '#myLandbot',
          configUrl:
            'https://storage.googleapis.com/landbot.online/v3/H-2677681-SQEQ6FI3JEY1LKYE/index.json',
        });
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

  const handleClick = () => {
    setShowChat(true); // Show chat
  };

  return (
    <section className="ai-chat">
      <div className="container">
        {!showChat && (
          <>
            <h3>Talk to our AI Agent</h3>
            <button onClick={handleClick}>Start Chat</button>
          </>
        )}
        {showChat && (
          <div id="myLandbot"></div>
        )}
      </div>
    </section>
  );
};

export default AiChat;
