import React, { useState } from 'react';
import { FaRobot, FaPaperPlane, FaComments, FaChartLine, FaHome, FaArrowRight, FaSearch, FaRegClock } from 'react-icons/fa';
import '../../styles/Home/AiChat.css';

const AiChat = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  const handleTryChatClick = () => {
    // Find the chatbot toggle button and click it
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    if (chatbotToggle) {
      chatbotToggle.click();
    }
  };
  
  return (
    <section className="ai-chat">
      <div className="ai-chat-split-container">
        {/* Left side - Marketing content (60%) */}
        <div className="ai-chat-marketing">
          <div className="marketing-content">
            <div className="ai-chat-icon">
              <FaRobot />
            </div>
            
            <div className="ai-chat-title-container">
              <h2 className="ai-chat-title">Your AI-Powered Real Estate Assistant</h2>
            </div>
            
            <p className="ai-chat-description">
              Get <span className="highlight">instant answers</span> to your property questions, <span className="highlight">personalized recommendations</span>, 
              and <span className="highlight">expert insights</span> powered by advanced AI technology.
            </p>
            
            <div className="ai-chat-features">
              <div className="feature">
                <div className="feature-icon">
                  <FaHome size={10} />
                </div>
                <div className="feature-text">Property Insights</div>
              </div>
              
              <div className="feature">
                <div className="feature-icon">
                  <FaChartLine size={10} />
                </div>
                <div className="feature-text">Market Analysis</div>
              </div>
              
              <div className="feature">
                <div className="feature-icon">
                  <FaSearch size={10} />
                </div>
                <div className="feature-text">Smart Recommendations</div>
              </div>
              
              <div className="feature">
                <div className="feature-icon">
                  <FaRegClock size={10} />
                </div>
                <div className="feature-text">24/7 Assistance</div>
              </div>
            </div>
            
            <button className="try-chat-button" onClick={handleTryChatClick}>
              <span>Try Now</span>
              <FaArrowRight />
            </button>
          </div>
        </div>
        
        {/* Right side - Chat bot (40%) */}
        <div className="ai-chat-bot">
          <div className="chat-animation">
            <div className="chat-animation-header">
              <div className="chat-animation-avatar">
                <FaRobot />
              </div>
              <div className="chat-animation-title">AI Real Estate Assistant</div>
            </div>
            
            <div className="chat-bubbles-container">
              <div className="chat-bubble agent">
                <div className="bubble-avatar">🏠</div>
                <div className="bubble-content">
                  <p>Hello! I'm your AI real estate assistant. How can I help you today?</p>
                </div>
              </div>
              
              <div className="chat-bubble user">
                <div className="bubble-content">
                  <p>I'm looking for a 3-bedroom house in the Boston area.</p>
                </div>
                <div className="bubble-avatar">👤</div>
              </div>
              
              <div className="chat-bubble agent">
                <div className="bubble-avatar">🏠</div>
                <div className="bubble-content">
                  <p>Great! I found 28 properties matching your criteria. Would you like to see properties with a garage?</p>
                </div>
              </div>
            </div>
            
            <div className="chat-animation-input">
              <div className="chat-input-field">Type your message...</div>
              <div className="chat-send-button">
                <FaPaperPlane size={14} />
              </div>
            </div>
            
            <button className="try-real-chat-button" onClick={handleTryChatClick}>
              Try the real chat assistant
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiChat;
