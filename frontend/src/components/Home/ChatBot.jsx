import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaComments, FaCalendarAlt, FaCheckCircle, FaThumbsUp, FaThumbsDown, FaStar } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Home/ChatBot.css';

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

// Predefined conversation flows
const chatFlows = {
  initial: {
    message: "Hello! I'm your AI real estate assistant. How can I help you today?",
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
    message: "Unlike traditional platforms, we use AI to understand your preferences deeply. We can predict which properties you'll love based on your behavior, provide market insights, and offer 24/7 assistance to answer your questions instantly.",
    options: [
      { label: "How accurate are the recommendations?", nextState: "buyer_accuracy" },
      { label: "How do I get started?", nextState: "buyer_start" },
      { label: "Go back", nextState: "buyer" }
    ]
  },
  buyer_accuracy: {
    message: "Our recommendation engine has a 92% satisfaction rate. The more you interact with listings, the better we understand your preferences. Users typically find their ideal property within 15 days of using our platform, compared to the industry average of 30+ days.",
    options: [
      { label: "How do I get started?", nextState: "buyer_start" },
      { label: "Go back", nextState: "buyer" }
    ]
  },
  buyer_start: {
    message: "Getting started is easy! Just create a free account on our homepage. You'll immediately get access to personalized property recommendations. You can also connect with our partner realtors who use our platform to provide you with an enhanced buying experience.",
    options: [
      { label: "Tell me about your realtors", nextState: "realtor_benefits" },
      { label: "Go back to main menu", nextState: "initial" }
    ]
  },
  seller: {
    message: "As a seller, our platform helps you connect with tech-savvy realtors who use AI to find the perfect buyers for your property. What would you like to know?",
    options: [
      { label: "How do you find buyers?", nextState: "seller_buyers" },
      { label: "What makes your platform better for selling?", nextState: "seller_advantages" },
      { label: "How do I list my property?", nextState: "seller_listing" },
      { label: "Schedule a seller consultation", nextState: "schedule_selling" },
      { label: "Go back", nextState: "initial" }
    ]
  },
  seller_buyers: {
    message: "Our AI matches your property with potential buyers based on their search patterns, preferences, and behavior. This means your property gets shown to the most relevant and interested buyers, increasing the chances of a quick sale at the right price.",
    options: [
      { label: "How fast can I sell my property?", nextState: "seller_speed" },
      { label: "How do I get started?", nextState: "seller_listing" },
      { label: "Go back", nextState: "seller" }
    ]
  },
  seller_advantages: {
    message: "Our platform offers detailed market analytics, optimal pricing suggestions based on real-time market data, and connects you with realtors who leverage our AI tools. Properties listed through our platform sell 20% faster on average and closer to the asking price.",
    options: [
      { label: "Tell me about your realtors", nextState: "realtor_benefits" },
      { label: "How do I get started?", nextState: "seller_listing" },
      { label: "Go back", nextState: "seller" }
    ]
  },
  seller_speed: {
    message: "Properties listed through our platform sell 20% faster than the market average. Our AI targets the right buyers and our partner realtors provide enhanced service using our technology. The exact time depends on your market and property type.",
    options: [
      { label: "How do I get started?", nextState: "seller_listing" },
      { label: "Go back", nextState: "seller" }
    ]
  },
  seller_listing: {
    message: "To list your property, you'll need to connect with one of our partner realtors. They have exclusive access to our AI tools and will guide you through the entire selling process. Would you like to find a realtor near you?",
    options: [
      { label: "Yes, find me a realtor", nextState: "find_realtor" },
      { label: "Tell me about your realtors first", nextState: "realtor_benefits" },
      { label: "Go back", nextState: "seller" }
    ]
  },
  find_realtor: {
    message: "Great! Please sign up for an account and use our 'Find a Realtor' feature. We'll match you with top-performing realtors in your area who use our platform. They'll contact you to discuss listing your property.",
    options: [
      { label: "How do realtors benefit from your platform?", nextState: "realtor_benefits" },
      { label: "Go back to main menu", nextState: "initial" }
    ]
  },
  realtor: {
    message: "Welcome! Our platform helps realtors leverage AI to work more efficiently and provide better service to clients. What would you like to know?",
    options: [
      { label: "What features do you offer realtors?", nextState: "realtor_features" },
      { label: "How does it save me time?", nextState: "realtor_time" },
      { label: "What does it cost?", nextState: "realtor_cost" },
      { label: "How do I sign up?", nextState: "realtor_signup" },
      { label: "Go back", nextState: "initial" }
    ]
  },
  realtor_features: {
    message: "Our platform offers realtors: AI-powered client matching, automated property recommendations, a customizable dashboard to track clients and properties, market analytics, performance metrics, lead generation tools, and a client portal for seamless communication.",
    options: [
      { label: "Tell me about client management", nextState: "realtor_clients" },
      { label: "How does it save me time?", nextState: "realtor_time" },
      { label: "What does it cost?", nextState: "realtor_cost" },
      { label: "Go back", nextState: "realtor" }
    ]
  },
  realtor_clients: {
    message: "Our client management system automatically tracks client preferences, provides property suggestions based on their behavior, and facilitates communication. You can monitor client activity, set up automated notifications, and manage your pipeline efficiently from a single dashboard.",
    options: [
      { label: "How does it save me time?", nextState: "realtor_time" },
      { label: "What does it cost?", nextState: "realtor_cost" },
      { label: "How do I sign up?", nextState: "realtor_signup" },
      { label: "Go back", nextState: "realtor" }
    ]
  },
  realtor_time: {
    message: "Our platform saves realtors an average of 15 hours per week through automated client matching, property recommendations, and administrative tasks. The AI handles routine inquiries and search filtering, leaving you more time to focus on closing deals and building relationships.",
    options: [
      { label: "What about lead generation?", nextState: "realtor_leads" },
      { label: "What does it cost?", nextState: "realtor_cost" },
      { label: "How do I sign up?", nextState: "realtor_signup" },
      { label: "Go back", nextState: "realtor" }
    ]
  },
  realtor_leads: {
    message: "Our platform helps generate quality leads through AI-optimized property listings and targeted marketing. Realtors using our system report a 40% increase in qualified leads and a 30% higher conversion rate compared to traditional methods.",
    options: [
      { label: "What does it cost?", nextState: "realtor_cost" },
      { label: "How do I sign up?", nextState: "realtor_signup" },
      { label: "Go back", nextState: "realtor" }
    ]
  },
  realtor_cost: {
    message: "We offer flexible subscription plans starting at $49/month for individual realtors. Team plans start at $199/month for up to 5 users with additional features. All plans include our core AI functionality, and we offer a 14-day free trial so you can experience the benefits firsthand.",
    options: [
      { label: "What features are included?", nextState: "realtor_features" },
      { label: "How do I sign up?", nextState: "realtor_signup" },
      { label: "Go back", nextState: "realtor" }
    ]
  },
  realtor_signup: {
    message: "Signing up is easy! Click the 'Sign Up' button on our homepage and select the 'Realtor' option. Complete your profile with your license information, area of service, and specialties. After verification (usually within 24 hours), you'll have full access to our platform.",
    options: [
      { label: "Are there any requirements?", nextState: "realtor_requirements" },
      { label: "Go back to main menu", nextState: "initial" }
    ]
  },
  realtor_requirements: {
    message: "To use our platform, you need to be a licensed real estate agent or broker. We verify your credentials during registration to ensure all realtors on our platform are qualified professionals. This helps maintain trust with clients using our service.",
    options: [
      { label: "How do I sign up?", nextState: "realtor_signup" },
      { label: "Go back to main menu", nextState: "initial" }
    ]
  },
  realtor_benefits: {
    message: "Our realtors leverage AI to provide exceptional service. They can access market analytics, client insights, and automated property matching. This means they can focus more on understanding your needs and negotiating the best deals, rather than mundane tasks.",
    options: [
      { label: "I'm a realtor interested in joining", nextState: "realtor" },
      { label: "Schedule an appointment", nextState: "schedule_appointment" },
      { label: "Go back to main menu", nextState: "initial" }
    ]
  },
  about: {
    message: "Our platform combines artificial intelligence with real estate expertise to create a smoother experience for buyers, sellers, and realtors. We use advanced algorithms to match properties with potential buyers, provide market insights, and streamline the entire real estate process.",
    options: [
      { label: "What makes your AI special?", nextState: "about_ai" },
      { label: "How does it help buyers?", nextState: "buyer" },
      { label: "How does it help sellers?", nextState: "seller" },
      { label: "How does it help realtors?", nextState: "realtor" },
      { label: "Go back", nextState: "initial" }
    ]
  },
  about_ai: {
    message: "Our AI technology analyzes thousands of data points about properties, market trends, and user preferences to make intelligent recommendations. Unlike simple search filters, our system learns from user behavior to understand subtle preferences and provide increasingly accurate suggestions.",
    options: [
      { label: "Is my data secure?", nextState: "about_security" },
      { label: "Go back", nextState: "about" }
    ]
  },
  about_security: {
    message: "Absolutely. We take data privacy very seriously. All user data is encrypted and securely stored. We never sell your personal information to third parties. Our AI uses anonymized data for training, and you can request to delete your data at any time.",
    options: [
      { label: "Tell me more about the platform", nextState: "about" },
      { label: "Go back to main menu", nextState: "initial" }
    ]
  },
  schedule_appointment: {
    message: "Great! I'd be happy to help you schedule an appointment with one of our expert realtors. What type of property are you interested in?",
    options: [
      { label: "Buying a property", nextState: "schedule_buying" },
      { label: "Selling a property", nextState: "schedule_selling" },
      { label: "General consultation", nextState: "schedule_consultation" },
      { label: "Go back", nextState: "initial" }
    ]
  },
  schedule_buying: {
    message: "Perfect. When would you like to schedule your home buying consultation?",
    options: [
      { label: "This week", nextState: "schedule_this_week" },
      { label: "Next week", nextState: "schedule_next_week" },
      { label: "Go back", nextState: "schedule_appointment" }
    ]
  },
  schedule_selling: {
    message: "Great. When would you like to schedule your property selling consultation?",
    options: [
      { label: "This week", nextState: "schedule_this_week" },
      { label: "Next week", nextState: "schedule_next_week" },
      { label: "Go back", nextState: "schedule_appointment" }
    ]
  },
  schedule_consultation: {
    message: "When would you like to schedule your general real estate consultation?",
    options: [
      { label: "This week", nextState: "schedule_this_week" },
      { label: "Next week", nextState: "schedule_next_week" },
      { label: "Go back", nextState: "schedule_appointment" }
    ]
  },
  schedule_this_week: {
    message: "Great! Here are some available time slots this week. Please select one:",
    appointmentSelector: true,
    timeframe: "this_week",
    options: [
      { label: "Go back", nextState: "schedule_appointment" }
    ]
  },
  schedule_next_week: {
    message: "Here are some available time slots for next week. Please select one:",
    appointmentSelector: true,
    timeframe: "next_week",
    options: [
      { label: "Go back", nextState: "schedule_appointment" }
    ]
  },
  appointment_details: {
    message: "Please provide your contact information so we can confirm your appointment:",
    contactForm: true,
    options: [
      { label: "Go back", nextState: "schedule_this_week" }
    ]
  },
  appointment_confirmed: {
    message: "Great! Your appointment has been scheduled. We've sent a confirmation to your email. A realtor will contact you soon to confirm the details.",
    appointmentConfirmed: true,
    options: [
      { label: "Ask another question", nextState: "initial" }
    ]
  },
  feedback_request: {
    message: "Thank you for using our chat assistant! How would you rate your experience today?",
    feedbackRequest: true,
    options: []
  },
  feedback_comment: {
    message: "Would you like to leave any additional comments to help us improve?",
    feedbackComment: true,
    options: [
      { label: "Skip", nextState: "feedback_thanks" }
    ]
  },
  feedback_thanks: {
    message: "Thank you for your feedback! Is there anything else I can help you with today?",
    options: [
      { label: "Yes, I have another question", nextState: "initial" },
      { label: "No, that's all for now", nextState: "goodbye" }
    ]
  },
  goodbye: {
    message: "Thank you for chatting with me today! If you need anything else, just click the chat button again. Have a great day!",
    options: []
  }
};

// Add to the initial flow options
chatFlows.initial.options.push({ label: "Schedule an appointment", nextState: "schedule_appointment" });
// Add to buyer flow
chatFlows.buyer.options.push({ label: "Schedule a buyer consultation", nextState: "schedule_buying" });
// Add to seller flow
chatFlows.seller.options.push({ label: "Schedule a seller consultation", nextState: "schedule_selling" });
// Add to realtor benefits flow - option to schedule with a realtor
chatFlows.realtor_benefits.options.unshift({ label: "Schedule an appointment", nextState: "schedule_appointment" });

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentState, setCurrentState] = useState('initial');
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const chatSessionRef = useRef(Date.now().toString());
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [messagesToShowBeforeFeedback, setMessagesToShowBeforeFeedback] = useState(0);
  
  // Only show on homepage
  const shouldShowChat = location.pathname === '/';

  // Initialize chat with welcome message
  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      addBotMessage(chatFlows.initial.message, chatFlows.initial.options);
    }
  }, [isOpen, messages.length]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if we should ask for feedback
  useEffect(() => {
    // After a certain number of messages, prompt for feedback if not already shown
    if (messages.length >= messagesToShowBeforeFeedback && messagesToShowBeforeFeedback > 0 && !showFeedback && isOpen) {
      handleRequestFeedback();
    }
  }, [messages.length, messagesToShowBeforeFeedback, showFeedback, isOpen]);

  // Don't render if not on homepage
  if (!shouldShowChat) return null;

  // Generate mock appointment slots
  const generateAppointmentSlots = (timeframe) => {
    const slots = [];
    const today = new Date();
    const startDate = new Date(today);
    
    // For this week starting tomorrow, or next week starting Monday
    if (timeframe === 'this_week') {
      startDate.setDate(today.getDate() + 1); // Tomorrow
    } else {
      // Next Monday
      startDate.setDate(today.getDate() + (8 - today.getDay()) % 7);
    }
    
    // Generate 5 days worth of slots
    for (let i = 0; i < 5; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Skip weekend days
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Generate 3 slots per day
      const times = ['10:00 AM', '1:00 PM', '4:00 PM'];
      times.forEach(time => {
        slots.push({
          id: `${date.toDateString()}-${time}`,
          date: date.toDateString(),
          time: time,
          available: Math.random() > 0.3 // 70% chance of availability
        });
      });
    }
    
    return slots.filter(slot => slot.available);
  };

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    
    // Track appointment selection
    trackChatbotEvent('appointment_selected', {
      session_id: chatSessionRef.current,
      appointment_date: appointment.date,
      appointment_time: appointment.time
    });
    
    addUserMessage(`I'd like to schedule for ${appointment.date} at ${appointment.time}`);
    setCurrentState('appointment_details');
    addBotMessage(chatFlows.appointment_details.message, chatFlows.appointment_details.options);
  };
  
  const handleContactInfoChange = (e) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value
    });
  };
  
  const handleContactSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      return;
    }
    
    // Track appointment confirmation
    trackChatbotEvent('appointment_confirmed', {
      session_id: chatSessionRef.current,
      appointment_date: selectedAppointment.date,
      appointment_time: selectedAppointment.time,
      user_name: contactInfo.name,
      user_email: contactInfo.email.substring(0, 2) + '...' // Only log first 2 chars for privacy
    });
    
    // Submit the appointment
    submitAppointment();
    
    // Update chat state
    addUserMessage(`My contact info: ${contactInfo.name}, ${contactInfo.email}`);
    setCurrentState('appointment_confirmed');
    addBotMessage(chatFlows.appointment_confirmed.message, chatFlows.appointment_confirmed.options);
  };
  
  const submitAppointment = async () => {
    try {
      // Convert date string to YYYY-MM-DD format
      const dateObj = new Date(selectedAppointment.date);
      const formattedDate = dateObj.toISOString().split('T')[0];
      
      // Send appointment to backend
      const response = await axios.post('/api/appointments', {
        date: formattedDate,
        time: selectedAppointment.time,
        name: contactInfo.name,
        email: contactInfo.email,
        phone: contactInfo.phone,
        message: `Scheduled via chatbot for ${selectedAppointment.date} at ${selectedAppointment.time}`
      });
      
      // Track successful appointment
      if (response.data.success) {
        trackChatbotEvent('appointment_saved', {
          session_id: chatSessionRef.current,
          appointment_id: response.data.appointmentId
        });
      }
      
      // Reset the form after successful submission
      setContactInfo({ name: '', email: '', phone: '' });
      
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      // Show error in chat
      addBotMessage("I'm sorry, there was an error scheduling your appointment. Please try again or contact us directly.", 
        [{ label: "Try again", nextState: "schedule_appointment" }, { label: "Go back to main menu", nextState: "initial" }]
      );
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    const newOpenState = !isOpen;
    setIsOpen(newOpenState);
    
    // Track chat open/close events
    trackChatbotEvent(newOpenState ? 'chat_opened' : 'chat_closed');
    
    // Reset chat if closing
    if (isOpen) {
      setTimeout(() => {
        setMessages([]);
        setCurrentState('initial');
        setShowFeedback(false);
        setFeedbackRating(0);
        setFeedbackComment('');
        // Generate new session ID for next conversation
        chatSessionRef.current = Date.now().toString();
      }, 300);
    } else {
      // Set the number of messages to show before requesting feedback
      // Random between 4-7 messages
      setMessagesToShowBeforeFeedback(Math.floor(Math.random() * 4) + 4);
    }
  };

  const addBotMessage = (text, options = null) => {
    setIsTyping(true);
    
    // Simulate typing delay for natural feel
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'bot', 
          text, 
          options
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [
      ...prev, 
      { 
        sender: 'user', 
        text 
      }
    ]);
    
    // Track user message event
    trackChatbotEvent('user_message', {
      session_id: chatSessionRef.current,
      message_length: text.length,
      current_state: currentState
    });
  };

  const handleOptionClick = (option) => {
    // Add user's selection as a message
    addUserMessage(option.label);
    
    // Track option selected
    trackChatbotEvent('option_selected', {
      session_id: chatSessionRef.current,
      option_text: option.label,
      from_state: currentState,
      to_state: option.nextState
    });
    
    // Update state and add the corresponding bot response
    setCurrentState(option.nextState);
    const nextFlow = chatFlows[option.nextState];
    addBotMessage(nextFlow.message, nextFlow.options);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (userInput.trim() === '') return;
    
    // Add user message
    addUserMessage(userInput);
    
    // Track free text message
    trackChatbotEvent('free_text_message', {
      session_id: chatSessionRef.current,
      message_length: userInput.length,
      current_state: currentState
    });
    
    setUserInput('');
    
    // Simple keyword matching for custom input
    const lowercaseInput = userInput.toLowerCase();
    let newState = '';
    
    if (lowercaseInput.includes('buy') || lowercaseInput.includes('buyer') || lowercaseInput.includes('purchase')) {
      newState = 'buyer';
      setCurrentState(newState);
      addBotMessage(chatFlows.buyer.message, chatFlows.buyer.options);
    } else if (lowercaseInput.includes('sell') || lowercaseInput.includes('seller') || lowercaseInput.includes('selling')) {
      newState = 'seller';
      setCurrentState(newState);
      addBotMessage(chatFlows.seller.message, chatFlows.seller.options);
    } else if (lowercaseInput.includes('realtor') || lowercaseInput.includes('agent') || lowercaseInput.includes('broker')) {
      newState = 'realtor';
      setCurrentState(newState);
      addBotMessage(chatFlows.realtor.message, chatFlows.realtor.options);
    } else if (lowercaseInput.includes('price') || lowercaseInput.includes('cost') || lowercaseInput.includes('fee')) {
      newState = 'realtor_cost';
      setCurrentState(newState);
      addBotMessage(chatFlows.realtor_cost.message, chatFlows.realtor_cost.options);
    } else if (lowercaseInput.includes('sign up') || lowercaseInput.includes('register') || lowercaseInput.includes('join')) {
      newState = 'realtor_signup';
      setCurrentState(newState);
      addBotMessage(chatFlows.realtor_signup.message, chatFlows.realtor_signup.options);
    } else if (lowercaseInput.includes('about') || lowercaseInput.includes('platform') || lowercaseInput.includes('work')) {
      newState = 'about';
      setCurrentState(newState);
      addBotMessage(chatFlows.about.message, chatFlows.about.options);
    } else {
      // If no keyword match, provide a generic response with main menu options
      newState = 'initial';
      addBotMessage(
        "I'm not sure I understood that. Here are some topics I can help with:", 
        chatFlows.initial.options
      );
    }
    
    // Track state change from free text
    trackChatbotEvent('state_change', {
      session_id: chatSessionRef.current,
      from_state: currentState,
      to_state: newState,
      trigger: 'free_text'
    });
  };

  const handleRequestFeedback = () => {
    setShowFeedback(true);
    setCurrentState('feedback_request');
    addBotMessage(chatFlows.feedback_request.message);
  };
  
  const handleFeedbackRating = (rating) => {
    setFeedbackRating(rating);
    
    // Track feedback 
    trackChatbotEvent('feedback_rating', {
      session_id: chatSessionRef.current,
      rating: rating
    });
    
    // Show text feedback request
    setCurrentState('feedback_comment');
    addBotMessage(chatFlows.feedback_comment.message, chatFlows.feedback_comment.options);
  };
  
  const handleFeedbackComment = () => {
    if (feedbackComment.trim() !== '') {
      // Track feedback comment
      trackChatbotEvent('feedback_comment', {
        session_id: chatSessionRef.current,
        rating: feedbackRating,
        comment: feedbackComment
      });
      
      // Submit feedback to backend
      submitFeedback();
      
      // Add user's comment to chat
      addUserMessage(feedbackComment);
    }
    
    // Show thank you message
    setCurrentState('feedback_thanks');
    addBotMessage(chatFlows.feedback_thanks.message, chatFlows.feedback_thanks.options);
    setFeedbackComment('');
  };
  
  const submitFeedback = async () => {
    try {
      await axios.post('/api/chatbot/feedback', {
        sessionId: chatSessionRef.current,
        rating: feedbackRating,
        comment: feedbackComment
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };
  
  const renderFeedbackStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i}
          className={`feedback-star ${i <= feedbackRating ? 'active' : ''}`}
          onClick={() => handleFeedbackRating(i)}
        />
      );
    }
    return stars;
  };

  return (
    <div className="chatbot-container">
      {/* Chat toggle button */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        aria-label="Toggle chat assistant"
      >
        {isOpen ? <FaTimes /> : <FaComments />}
      </button>
      
      {/* Chat window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-title">
            <FaRobot className="chatbot-icon" />
            <span>AI Real Estate Assistant</span>
          </div>
          <button 
            className="chatbot-close" 
            onClick={toggleChat}
            aria-label="Close chat"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.sender === 'bot' ? 'bot' : 'user'}`}
            >
              {message.sender === 'bot' && (
                <div className="bot-avatar">
                  <FaRobot />
                </div>
              )}
              <div className="message-content">
                <p>{message.text}</p>
                
                {/* Appointment slot selector */}
                {message.sender === 'bot' && currentState.includes('schedule_') && 
                  chatFlows[currentState]?.appointmentSelector && (
                  <div className="appointment-selector">
                    {generateAppointmentSlots(chatFlows[currentState].timeframe).map((slot) => (
                      <button 
                        key={slot.id}
                        className="appointment-slot"
                        onClick={() => handleAppointmentSelect(slot)}
                      >
                        <FaCalendarAlt />
                        <div className="appointment-details">
                          <div className="appointment-date">{slot.date}</div>
                          <div className="appointment-time">{slot.time}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Contact form */}
                {message.sender === 'bot' && currentState === 'appointment_details' && (
                  <form className="contact-form" onSubmit={handleContactSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={contactInfo.name}
                        onChange={handleContactInfoChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactInfo.email}
                        onChange={handleContactInfoChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={contactInfo.phone}
                        onChange={handleContactInfoChange}
                        required
                      />
                    </div>
                    <button type="submit" className="submit-button">
                      Schedule Appointment
                    </button>
                  </form>
                )}
                
                {/* Appointment confirmation */}
                {message.sender === 'bot' && currentState === 'appointment_confirmed' && (
                  <div className="confirmation-message">
                    <FaCheckCircle className="confirmation-icon" />
                    <p>
                      <strong>Appointment Details:</strong><br />
                      Date: {selectedAppointment?.date}<br />
                      Time: {selectedAppointment?.time}<br />
                      Name: {contactInfo.name}
                    </p>
                  </div>
                )}
                
                {/* Feedback stars */}
                {message.sender === 'bot' && currentState === 'feedback_request' && (
                  <div className="feedback-stars">
                    {renderFeedbackStars()}
                  </div>
                )}
                
                {/* Feedback comment input */}
                {message.sender === 'bot' && currentState === 'feedback_comment' && (
                  <div className="feedback-comment">
                    <textarea
                      placeholder="Please share your thoughts on how we can improve..."
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      rows={3}
                    />
                    <button 
                      className="submit-button"
                      onClick={handleFeedbackComment}
                    >
                      Submit Feedback
                    </button>
                  </div>
                )}
                
                {/* Options buttons */}
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
                <div className="user-avatar">
                  <div className="avatar-placeholder">U</div>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot typing">
              <div className="bot-avatar">
                <FaRobot />
              </div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <form className="chatbot-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type your message..."
            value={userInput}
            onChange={handleInputChange}
          />
          <button type="submit" className="send-button">
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot; 