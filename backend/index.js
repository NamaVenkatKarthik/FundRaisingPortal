const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory data storage (replace with database in production)
let users = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123', // In production, hash passwords!
        phone: '+91-9876543210',
        referralCode: 'JOHN2025',
        totalDonations: 12500,
        totalReferrals: 8,
        joinedDate: new Date('2025-01-15')
    },
    {
        id: 2,
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: 'password123',
        phone: '+91-9876543211',
        referralCode: 'PRIYA2025',
        totalDonations: 18750,
        totalReferrals: 12,
        joinedDate: new Date('2025-01-10')
    },
    {
        id: 3,
        name: 'Rahul Kumar',
        email: 'rahul@example.com',
        password: 'password123',
        phone: '+91-9876543212',
        referralCode: 'RAHUL2025',
        totalDonations: 9200,
        totalReferrals: 5,
        joinedDate: new Date('2025-01-20')
    }
];

let donations = [
    { id: 1, userId: 1, amount: 5000, date: new Date('2025-02-01'), referredBy: null },
    { id: 2, userId: 1, amount: 7500, date: new Date('2025-02-15'), referredBy: 2 },
    { id: 3, userId: 2, amount: 10000, date: new Date('2025-01-25'), referredBy: null },
    { id: 4, userId: 2, amount: 8750, date: new Date('2025-02-10'), referredBy: null },
    { id: 5, userId: 3, amount: 4200, date: new Date('2025-02-05'), referredBy: 1 },
    { id: 6, userId: 3, amount: 5000, date: new Date('2025-02-20'), referredBy: 1 }
];

// Utility functions
function generateReferralCode(name) {
    return `${name.toUpperCase().replace(/\s+/g, '').substring(0, 8)}2025`;
}

function calculateUserStats(userId) {
    const userDonations = donations.filter(d => d.userId === userId);
    const totalDonations = userDonations.reduce((sum, d) => sum + d.amount, 0);
    const totalReferrals = donations.filter(d => d.referredBy === userId).length;
    
    return { totalDonations, totalReferrals };
}

function getUserRank(userId) {
    const userStats = users.map(user => ({
        id: user.id,
        ...calculateUserStats(user.id)
    })).sort((a, b) => b.totalDonations - a.totalDonations);
    
    const rank = userStats.findIndex(u => u.id === userId) + 1;
    return rank;
}

// Routes

// Health check
app.get('/', (req, res) => {
    res.json({ 
        message: 'Fundraising Intern Portal API',
        status: 'running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Don't send password in response
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({
            success: true,
            message: 'Login successful',
            user: userWithoutPassword
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.post('/api/auth/signup', (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        
        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        
        // Create new user
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password, // In production, hash this!
            phone,
            referralCode: generateReferralCode(name),
            totalDonations: 0,
            totalReferrals: 0,
            joinedDate: new Date()
        };
        
        users.push(newUser);
        
        // Don't send password in response
        const { password: _, ...userWithoutPassword } = newUser;
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: userWithoutPassword
        });
        
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// User routes
app.get('/api/user/profile/:email', (req, res) => {
    try {
        const { email } = req.params;
        
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        const stats = calculateUserStats(user.id);
        const rank = getUserRank(user.id);
        
        // Don't send password in response
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({
            success: true,
            user: {
                ...userWithoutPassword,
                ...stats,
                currentRank: rank
            }
        });
        
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Leaderboard route
app.get('/api/leaderboard', (req, res) => {
    try {
        const leaderboard = users.map(user => {
            const stats = calculateUserStats(user.id);
            return {
                id: user.id,
                name: user.name,
                referralCode: user.referralCode,
                ...stats,
                joinedDate: user.joinedDate
            };
        }).sort((a, b) => b.totalDonations - a.totalDonations);
        
        // Add rank to each user
        const leaderboardWithRank = leaderboard.map((user, index) => ({
            ...user,
            rank: index + 1
        }));
        
        res.json({
            success: true,
            leaderboard: leaderboardWithRank
        });
        
    } catch (error) {
        console.error('Leaderboard fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Donations routes
app.get('/api/donations/:userId', (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const userDonations = donations.filter(d => d.userId === userId);
        
        res.json({
            success: true,
            donations: userDonations
        });
        
    } catch (error) {
        console.error('Donations fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.post('/api/donations', (req, res) => {
    try {
        const { userId, amount, referredBy } = req.body;
        
        if (!userId || !amount) {
            return res.status(400).json({
                success: false,
                message: 'User ID and amount are required'
            });
        }
        
        const newDonation = {
            id: donations.length + 1,
            userId: parseInt(userId),
            amount: parseFloat(amount),
            date: new Date(),
            referredBy: referredBy ? parseInt(referredBy) : null
        };
        
        donations.push(newDonation);
        
        res.status(201).json({
            success: true,
            message: 'Donation recorded successfully',
            donation: newDonation
        });
        
    } catch (error) {
        console.error('Donation creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Analytics route
app.get('/api/analytics', (req, res) => {
    try {
        const totalUsers = users.length;
        const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
        const totalDonationsCount = donations.length;
        const avgDonationAmount = totalDonations / totalDonationsCount;
        
        const monthlyStats = donations.reduce((stats, donation) => {
            const month = donation.date.toISOString().substring(0, 7); // YYYY-MM
            if (!stats[month]) {
                stats[month] = { count: 0, amount: 0 };
            }
            stats[month].count++;
            stats[month].amount += donation.amount;
            return stats;
        }, {});
        
        res.json({
            success: true,
            analytics: {
                totalUsers,
                totalDonations,
                totalDonationsCount,
                avgDonationAmount: Math.round(avgDonationAmount),
                monthlyStats
            }
        });
        
    } catch (error) {
        console.error('Analytics fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Referral validation route
app.get('/api/referral/:code', (req, res) => {
    try {
        const { code } = req.params;
        
        const referrer = users.find(u => u.referralCode === code.toUpperCase());
        
        if (!referrer) {
            return res.status(404).json({
                success: false,
                message: 'Invalid referral code'
            });
        }
        
        res.json({
            success: true,
            referrer: {
                id: referrer.id,
                name: referrer.name,
                referralCode: referrer.referralCode
            }
        });
        
    } catch (error) {
        console.error('Referral validation error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Fundraising Portal API running on port ${PORT}`);
    console.log(`📝 API Documentation: http://localhost:${PORT}`);
    console.log(`🔗 Frontend URL: http://localhost:3000` );
    console.log('\n📊 Available endpoints:');
    console.log('  POST /api/auth/login');
    console.log('  POST /api/auth/signup');
    console.log('  GET  /api/user/profile/:email');
    console.log('  GET  /api/leaderboard');
    console.log('  GET  /api/donations/:userId');
    console.log('  POST /api/donations');
    console.log('  GET  /api/analytics');
    console.log('  GET  /api/referral/:code');
});

module.exports = app;