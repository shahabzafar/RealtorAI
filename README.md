# RealtorAI: AI-Assisted Real Estate Platform

## Overview
RealtorAI is a comprehensive web-based platform designed to revolutionize real estate workflows by leveraging AI technologies. This system streamlines client acquisition, lead management, market analysis, and transaction processes for real estate professionals.

**Live Demo**: [https://realtoriq.onrender.com](https://realtoriq.onrender.com)

## Key Features
- 🧠 **AI-Powered Virtual Assistant** for market insights and document generation
- 📊 Property valuation and market trend prediction models
- 🤝 Automated lead management with priority classification
- 📝 Digital forms for listing agreements and client onboarding
- 📅 Automated appointment scheduling
- 🔍 Property search with intelligent filtering
- 🔐 Secure OAuth authentication
- 📱 Responsive design for all devices

## Technology Stack
| Component          | Technologies                                                                 |
|--------------------|------------------------------------------------------------------------------|
| **Frontend**       | React.js, Tailwind CSS, Figma (UI/UX)                                        |
| **Backend**        | Node.js, Express.js                                                          |
| **Database**       | PostgreSQL                                                                   |
| **AI/ML**          | Python, Scikit-Learn, XGBoost, Optuna (Hyperparameter tuning)               |
| **Automation**     | Zapier (Workflows), Botpress (NLP Chatbot)                                   |
| **Authentication** | Passport.js, Google OAuth, bcrypt                                            |
| **Deployment**     | Render (Cloud Hosting)                                                       |
| **Analytics**      | Lighthouse (Performance), pgTAP (Database testing)                           |

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- PostgreSQL
- npm

### Installation
```bash
# Clone repository
git clone https://github.com/shahabzafar/RealtorAI.git
cd RealtorAI

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Set up environment variables (create .env files in both directories)
# Example .env contents in backend:
DATABASE_URL=postgres://user:password@localhost:5432/realtorai
SESSION_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret

# Run application
cd ../backend
npm start  # Starts backend server

cd ../frontend
npm start  # Starts React development server
