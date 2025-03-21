import React, { useEffect, useRef } from 'react';

const ChatWidget = () => {
  const initialized = useRef(false);
  const scriptRefs = useRef([]);

  // Initialize Botpress when the component mounts
  useEffect(() => {
    const initializeBot = () => {
      try {
        // Inject the Botpress scripts
        const script1 = document.createElement('script');
        script1.src = 'https://cdn.botpress.cloud/webchat/v2.2/inject.js';
        script1.async = true;
        script1.id = 'botpress-script-inject';
        document.body.appendChild(script1);
        scriptRefs.current.push(script1);

        // Add the Botpress bot configuration script
        const script2 = document.createElement('script');
        script2.src = 'https://files.bpcontent.cloud/2025/01/29/18/20250129180946-OYG7OBFS.js';
        script2.async = true;
        script2.id = 'botpress-script-config';
        document.body.appendChild(script2);
        scriptRefs.current.push(script2);

        initialized.current = true;
      } catch (error) {
        console.error('Error initializing Botpress Bot:', error);
      }
    };

    // Only initialize if not already done
    if (!initialized.current) {
      initializeBot();
    }

    // Make sure the chat button is visible
    setTimeout(() => {
      const botpressWidget = document.querySelector('.bp-widget-web');
      if (botpressWidget) {
        botpressWidget.style.display = 'block';
      }
    }, 1000);

    // Clean up function to remove Botpress when component unmounts
    return () => {
      // Remove the scripts
      scriptRefs.current.forEach(script => {
        if (script && document.body.contains(script)) {
          document.body.removeChild(script);
        }
      });

      // Remove any Botpress DOM elements
      const botpressElements = document.querySelectorAll('[class^="bp-"]');
      botpressElements.forEach(el => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });

      // Reset initialized state
      initialized.current = false;
      scriptRefs.current = [];
    };
  }, []);

  // The component doesn't render anything visible
  return null;
};

export default ChatWidget; 