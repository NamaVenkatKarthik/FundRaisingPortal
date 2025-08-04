# FundRaisingPortal


# 💰 Fundraising Intern Portal

A full-stack web application for managing fundraising interns with dashboard, leaderboard, and referral system.


## 🚀 Features

### Frontend
- *Authentication*: Login/Signup pages with form validation
- *Dashboard*: Personal stats, referral codes, and rewards system
- *Leaderboard*: Real-time ranking of top performers
- *Responsive Design*: Works on desktop, tablet, and mobile
- *Interactive UI*: Modern design with animations and hover effects

### Backend
- *REST API*: Complete API with authentication and data management
- *User Management*: Registration, login, and profile management
- *Donation Tracking*: Record and track donations with referral attribution
- *Leaderboard System*: Real-time ranking based on performance
- *Analytics*: Basic analytics for tracking overall performance


## 📁 Project Structure


FundRaisingPortal/
├── frontend/
│   ├── index.html          # Login/Signup page
│   ├── dashboard.html      # Main dashboard
│   ├── style.css          # All styling
│   └── script.js          # Frontend JavaScript
├── backend/
│   ├── index.js           # Express server
│   └── package.json       # Dependencies
└── README.md             # This file


## 🛠 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Web browser

### Backend Setup

1. *Navigate to backend directory*
bash
cd FundRaisingPortal/backend


2. *Install dependencies*
bash
npm install


3. *Start the server*
bash
npm start


### Frontend Setup

1. *Navigate to frontend directory*
bash
cd FundRaisingPortal/frontend

 Use Live Server (Recommended)*
   - Install Live Server extension in VS Code
   - Right-click on index.html → "Open with Live Server"


## 📚 API Endpoints

### Authentication
- POST /api/auth/login - User login
- POST /api/auth/signup - User registration

### User Management
- GET /api/user/profile/:email - Get user profile and stats

### Leaderboard
- GET /api/leaderboard - Get ranked list of all users

### Donations
- GET /api/donations/:userId - Get user's donation history
- POST /api/donations - Record new donation

### Analytics
- GET /api/analytics - Get overall platform statistics

### Referrals
- GET /api/referral/:code - Validate referral code


## 🧪 Demo Data

The application comes with pre-loaded demo data:

*Demo Users:*
- john@example.com / password123
- priya@example.com / password123  
- rahul@example.com / password123

*Features Demonstrated:*
- User authentication flow
- Dashboard with personal stats
- Dynamic leaderboard
- Reward system based on donation amounts
- Referral code generation and copying

## 🎯 Usage

1. *Registration/Login*: Start by creating an account or logging in
2. *Dashboard*: View your personal stats, referral code, and rewards
3. *Referral System*: Share your referral code to earn bonus points
4. *Leaderboard*: Check your ranking against other interns
5. *Rewards*: Unlock badges and achievements based on performance
