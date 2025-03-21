import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaChartLine, FaHome, FaSearch, FaRegClock } from 'react-icons/fa';
import '../../styles/Home/AiChat.css';
import axios from 'axios';

// Track chatbot analytics
const trackChatbotEvent = async (eventName, data = {}) => {
  // Check if analytics is available (to avoid errors if not loaded)
  if (window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'Chatbot',
      ...data
    });
  }
  
  // For development - log analytics events
  console.log(`ChatEvent: ${eventName}`, data);
  
  // Send to backend for recording in database
  try {
    await axios.post('/api/chatbot/analytics', {
      eventType: eventName,
      sessionId: data.session_id || 'anonymous',
      data
    });
  } catch (error) {
    console.error('Failed to record chatbot analytics:', error);
  }
};

// Comprehensive conversation flows with detailed answers
const chatFlows = {
  initial: {
    message: "Hello! I'm your AI real estate assistant powered by advanced machine learning. I can help you find properties, evaluate market conditions, connect with agents, and more. How can I help you today?",
    options: [
      { label: "I'm a potential buyer", nextState: "buyer" },
      { label: "I'm a seller looking for help", nextState: "seller" },
      { label: "I'm a realtor interested in your platform", nextState: "realtor" },
      { label: "Tell me about your platform", nextState: "about" },
      { label: "Schedule an appointment", nextState: "schedule_appointment" }
    ]
  },
  buyer: {
    message: "Great! As a buyer, our platform helps you find the perfect property with AI-powered recommendations. What would you like to know?",
    options: [
      { label: "How does the property search work?", nextState: "buyer_search" },
      { label: "What makes your platform different?", nextState: "buyer_unique" },
      { label: "How do I get started?", nextState: "buyer_start" },
      { label: "Schedule a buyer consultation", nextState: "schedule_buying" },
      { label: "Go back", nextState: "initial" }
    ]
  },
  buyer_search: {
    message: "Our AI analyzes thousands of listings and matches them with your preferences. We consider location, amenities, price trends, and even commute times to find properties that best match your needs.",
    options: [
      { label: "Tell me more about the platform", nextState: "about" },
      { label: "How do I get started?", nextState: "buyer_start" },
      { label: "Go back", nextState: "buyer" }
    ]
  },
  buyer_unique: {
    message: "Unlike traditional real estate platforms, we use advanced AI to learn your preferences over time. Our platform offers 3D virtual tours, neighborhood analytics, price prediction tools, and personalized alerts when properties matching your exact criteria become available.",
    options: [
      { label: "How accurate are the price predictions?", nextState: "price_prediction" },
      { label: "Tell me about the virtual tours", nextState: "virtual_tours" },
      { label: "Go back", nextState: "buyer" }
    ]
  },
  price_prediction: {
    message: "Our price prediction algorithm is 94% accurate and uses data from recent sales, market trends, property features, and economic indicators. It's updated daily to reflect the latest market conditions.",
    options: [
      { label: "How do I get started?", nextState: "buyer_start" },
      { label: "Go back", nextState: "buyer_unique" }
    ]
  },
  virtual_tours: {
    message: "Our 3D virtual tours allow you to explore properties from the comfort of your home. You can walk through each room, check measurements, and even visualize furniture placement using our AR technology.",
    options: [
      { label: "How do I get started?", nextState: "buyer_start" },
      { label: "Go back", nextState: "buyer_unique" }
    ]
  },
  buyer_start: {
    message: "Getting started is easy! Simply create a free account, complete your preference profile, and our AI will immediately start matching you with properties. You can refine your search criteria anytime, schedule viewings, and even make offers directly through our platform.",
    options: [
      { label: "Schedule a demo", nextState: "schedule_demo" },
      { label: "Go back to main menu", nextState: "initial" }
    ]
  },
  seller: {
    message: "As a seller, our platform helps you maximize your property's value and find qualified buyers faster. How can we assist with your property sale?",
    options: [
      { label: "How do you determine my property value?", nextState: "property_valuation" },
      { label: "How do you market my property?", nextState: "property_marketing" },
      { label: "What fees do you charge?", nextState: "seller_fees" },
      { label: "How long does it take to sell?", nextState: "selling_timeline" },
      { label: "Go back", nextState: "initial" }
    ]
  },
  property_valuation: {
    message: "We use a combination of AI analysis, recent comparable sales, current market trends, and property-specific features to determine an accurate valuation. Our estimates are typically within 3% of the final selling price.",
    options: [
      { label: "Get a free property valuation", nextState: "free_valuation" },
      { label: "Learn about marketing my property", nextState: "property_marketing" },
      { label: "Go back", nextState: "seller" }
    ]
  },
  property_marketing: {
    message: "We market your property through multiple channels: professional photography, virtual tours, targeted social media campaigns, our buyer network, and major listing platforms. Our AI targets buyers most likely to be interested in your specific property.",
    options: [
      { label: "What makes your marketing approach better?", nextState: "marketing_advantage" },
      { label: "What fees do you charge?", nextState: "seller_fees" },
      { label: "Go back", nextState: "seller" }
    ]
  },
  marketing_advantage: {
    message: "Our AI-driven targeting reaches 3x more qualified buyers than traditional methods. We analyze buyer behavior data to show your property to people most likely to purchase, resulting in faster sales and better offers.",
    options: [
      { label: "Get started with selling", nextState: "seller_start" },
      { label: "Learn about fees", nextState: "seller_fees" },
      { label: "Go back", nextState: "property_marketing" }
    ]
  },
  seller_fees: {
    message: "Our standard commission is 4.5%, lower than the industry average of 5-6%. We offer flexible packages based on your needs, including à la carte services if you prefer to handle certain aspects yourself.",
    options: [
      { label: "How do I get started selling?", nextState: "seller_start" },
      { label: "Talk to an agent about fees", nextState: "schedule_seller_consult" },
      { label: "Go back", nextState: "seller" }
    ]
  },
  selling_timeline: {
    message: "Properties listed with us sell 30% faster than the market average. Most homes receive multiple offers within the first 14 days of listing. The entire process from listing to closing typically takes 45-60 days, depending on your local market.",
    options: [
      { label: "Get started with selling", nextState: "seller_start" },
      { label: "Talk to an agent", nextState: "schedule_seller_consult" },
      { label: "Go back", nextState: "seller" }
    ]
  },
  seller_start: {
    message: "To start selling your property, schedule a free consultation with one of our agents. They'll guide you through the valuation process, discuss marketing strategies, and help prepare your property for listing.",
    options: [
      { label: "Schedule a consultation", nextState: "schedule_seller_consult" },
      { label: "Go back to main menu", nextState: "initial" }
    ]
  },
  realtor: {
    message: "Our platform helps realtors increase productivity and client satisfaction through AI-powered tools. What aspects of our platform are you interested in?",
    options: [
      { label: "Lead generation features", nextState: "realtor_leads" },
      { label: "Client management tools", nextState: "realtor_client_mgmt" },
      { label: "Marketing automation", nextState: "realtor_marketing" },
      { label: "Pricing for realtors", nextState: "realtor_pricing" },
      { label: "Go back", nextState: "initial" }
    ]
  },
  realtor_leads: {
    message: "Our lead generation system uses AI to identify high-intent buyers and sellers. Leads are scored based on likelihood to transact, helping you focus on the most promising prospects. Our realtors report a 40% higher conversion rate compared to traditional lead sources.",
    options: [
      { label: "Learn about client management", nextState: "realtor_client_mgmt" },
      { label: "Pricing for realtors", nextState: "realtor_pricing" },
      { label: "Go back", nextState: "realtor" }
    ]
  },
  realtor_client_mgmt: {
    message: "Our client management system helps you nurture relationships through automated follow-ups, property alerts, and milestone tracking. The built-in CRM keeps all client communications organized and accessible from any device.",
    options: [
      { label: "Marketing automation features", nextState: "realtor_marketing" },
      { label: "Pricing for realtors", nextState: "realtor_pricing" },
      { label: "Go back", nextState: "realtor" }
    ]
  },
  realtor_marketing: {
    message: "Our marketing automation creates professional listing materials, social media posts, email campaigns, and virtual tours. The AI personalizes content based on property features and target buyer demographics.",
    options: [
      { label: "Lead generation features", nextState: "realtor_leads" },
      { label: "Pricing for realtors", nextState: "realtor_pricing" },
      { label: "Go back", nextState: "realtor" }
    ]
  },
  realtor_pricing: {
    message: "We offer flexible pricing plans starting at $99/month. All plans include core features with tiered access to premium tools based on your needs. Enterprise solutions are available for brokerages with custom pricing.",
    options: [
      { label: "Schedule a demo", nextState: "schedule_demo" },
      { label: "Go back", nextState: "realtor" }
    ]
  },
  about: {
    message: "Our platform combines AI technology with real estate expertise to create a better experience for buyers, sellers, and realtors. We process millions of data points to provide accurate valuations, personalized recommendations, and market insights.",
    options: [
      { label: "Platform features", nextState: "platform_features" },
      { label: "Our technology", nextState: "technology" },
      { label: "Success stories", nextState: "success_stories" },
      { label: "Go back", nextState: "initial" }
    ]
  },
  platform_features: {
    message: "Our platform offers AI-powered property matching, 3D virtual tours, market analytics, automated valuation tools, and streamlined transaction management. All features are accessible via web and mobile apps.",
    options: [
      { label: "I'm a buyer", nextState: "buyer" },
      { label: "I'm a seller", nextState: "seller" },
      { label: "I'm a realtor", nextState: "realtor" },
      { label: "Go back", nextState: "about" }
    ]
  },
  technology: {
    message: "Our proprietary AI uses machine learning algorithms trained on millions of property transactions and market data points. The system continuously improves its recommendations and predictions as it learns from user interactions.",
    options: [
      { label: "Platform features", nextState: "platform_features" },
      { label: "Success stories", nextState: "success_stories" },
      { label: "Go back", nextState: "about" }
    ]
  },
  success_stories: {
    message: "Our platform has helped over 50,000 families find their perfect home and facilitated more than $12 billion in real estate transactions. Clients report saving an average of 120 hours in their property search and 15% on transaction costs.",
    options: [
      { label: "I'm ready to get started", nextState: "ready_start" },
      { label: "Go back", nextState: "about" }
    ]
  },
  schedule_appointment: {
    message: "We'd be happy to schedule an appointment with one of our real estate experts. What type of consultation are you looking for?",
    options: [
      { label: "Buyer consultation", nextState: "schedule_buying" },
      { label: "Seller consultation", nextState: "schedule_seller_consult" },
      { label: "Platform demo", nextState: "schedule_demo" },
      { label: "Go back", nextState: "initial" }
    ]
  },
  schedule_buying: {
    message: "Great! To schedule a buyer consultation, please provide your contact information through our secure form, and one of our specialists will contact you within 24 hours to set up a meeting at your convenience.",
    options: [
      { label: "Complete contact form", nextState: "contact_form" },
      { label: "Go back", nextState: "schedule_appointment" }
    ]
  },
  schedule_seller_consult: {
    message: "To schedule a seller consultation, please provide your property details and contact information. A listing specialist will contact you within 24 hours to arrange a convenient time for your consultation.",
    options: [
      { label: "Complete contact form", nextState: "contact_form" },
      { label: "Go back", nextState: "schedule_appointment" }
    ]
  },
  schedule_demo: {
    message: "Our platform demos are personalized to your specific needs. Please provide your information, and a product specialist will arrange a one-on-one demonstration of the features most relevant to you.",
    options: [
      { label: "Complete contact form", nextState: "contact_form" },
      { label: "Go back", nextState: "schedule_appointment" }
    ]
  },
  contact_form: {
    message: "Thank you for your interest! Please fill out our contact form at the link below, and we'll be in touch shortly. Or, if you prefer, you can call us directly at (800) 555-1234.",
    options: [
      { label: "Return to main menu", nextState: "initial" }
    ]
  },
  ready_start: {
    message: "Excellent! Whether you're buying, selling, or a real estate professional, we're ready to help you succeed. What would you like to do next?",
    options: [
      { label: "Create an account", nextState: "create_account" },
      { label: "Schedule a consultation", nextState: "schedule_appointment" },
      { label: "Return to main menu", nextState: "initial" }
    ]
  },
  create_account: {
    message: "Creating an account is simple and free. Visit our sign-up page to get started. Once registered, you'll have immediate access to our basic features, with the option to upgrade to premium services anytime.",
    options: [
      { label: "Return to main menu", nextState: "initial" }
    ]
  }
};

const AiChat = () => {
  const [messages, setMessages] = useState([]);
  const [currentState, setCurrentState] = useState('initial');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatSessionRef = useRef(Date.now().toString());
  const chatBubblesRef = useRef(null);
  
  // Initialize chat with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addBotMessage(chatFlows.initial.message, chatFlows.initial.options);
    }
  }, [messages.length]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatBubblesRef.current) {
      chatBubblesRef.current.scrollTop = chatBubblesRef.current.scrollHeight;
    }
  };

  const addBotMessage = (text, options = null, delay = 1000) => {
    setIsTyping(true);
    
    // Track the bot message in analytics
    trackChatbotEvent('bot_message', {
      session_id: chatSessionRef.current,
      message: text
    });
    
    // Simulate typing delay
    setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages,
        {
          sender: 'bot',
          content: text,
          options: options,
          timestamp: new Date().toISOString()
        }
      ]);
      setIsTyping(false);
    }, delay);
  };

  const addUserMessage = (text) => {
    const newMessage = {
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Track the user message in analytics
    trackChatbotEvent('user_message', {
      session_id: chatSessionRef.current,
      message: text
    });
    
    return newMessage;
  };

  const handleOptionClick = (option) => {
    // Track the option click
    trackChatbotEvent('option_selected', {
      session_id: chatSessionRef.current,
      option: option.label
    });
    
    // Add the option text as a user message
    addUserMessage(option.label);
    
    // Set the new conversation state
    setCurrentState(option.nextState);
    
    // If we have a flow for this state, send the corresponding bot message
    if (chatFlows[option.nextState]) {
      addBotMessage(
        chatFlows[option.nextState].message,
        chatFlows[option.nextState].options
      );
    } else {
      // Fallback for states without defined flows
      addBotMessage(
        "I'm processing your request. How else can I help you?",
        chatFlows.initial.options
      );
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
            
            <div className="chat-bubbles-container" ref={chatBubblesRef}>
              {messages.map((message, index) => (
                <div key={index} className={`chat-bubble ${message.sender}`}>
                  {message.sender === 'bot' && (
                    <div className="bubble-avatar">🏠</div>
                  )}
                  <div className="bubble-content">
                    <p>{message.content}</p>
                    {message.options && (
                      <div className="message-options">
                        {message.options.map((option, optIndex) => (
                          <button 
                            key={optIndex} 
                            onClick={() => handleOptionClick(option)}
                            className="option-button"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {message.sender === 'user' && (
                    <div className="bubble-avatar">👤</div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="chat-bubble bot typing">
                  <div className="bubble-avatar">🏠</div>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiChat;
