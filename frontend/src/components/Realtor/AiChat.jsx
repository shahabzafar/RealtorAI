import React, { useEffect, useRef } from 'react';
import '../../styles/Realtor/AiChat.css';

const AiChat = () => {
    const botInstanceRef = useRef(null);

    useEffect(() => {
        const initializeBot = () => {
            try {

                const existingScript = document.querySelector(
                    'script[src="https://cdn.botpress.cloud/webchat/v2.2/inject.js"]'
                );

                if (!existingScript) {
                    const script1 = document.createElement('script');
                    script1.src = 'https://cdn.botpress.cloud/webchat/v2.2/inject.js';
                    script1.async = true;
                    document.body.appendChild(script1);
                }

                const script2 = document.createElement('script');
                script2.src = 'https://files.bpcontent.cloud/2025/01/29/18/20250129180946-OYG7OBFS.js';
                script2.async = true;
                document.body.appendChild(script2);

            } catch (error) {
                console.error('Error initializing Botpress Bot:', error);
            }
        };


        initializeBot();
    }, []);

    return (
        <section className="ai-chat-section expanded">
            <div id="myBot" className="landbot-container"></div>
        </section>
    );
};

export default AiChat;
