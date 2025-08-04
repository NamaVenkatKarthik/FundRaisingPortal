// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Global state
let currentUser = null;

// Auth UI functions
function showSignup() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginFormElement');
    const signupForm = document.getElementById('signupFormElement');
    
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
    
    checkAuthStatus();
});

// Login handler
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        showLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        // Store auth data
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        
        showMessage('Login successful! Redirecting...', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
        
    } catch (error) {
        showMessage('Login failed. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Signup handler
async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    
    try {
        showLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        showMessage('Account created successfully! Please login.', 'success');
        setTimeout(showLogin, 2000);
        
    } catch (error) {
        showMessage('Signup failed. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Dashboard initialization
async function initializeDashboard() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!isLoggedIn || !userEmail) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const userData = await fetchUserData(userEmail);
        const leaderboardData = await fetchLeaderboardData();
        
        updateDashboardUI(userData);
        updateLeaderboard(leaderboardData);
        updateRewards(userData.totalDonations);
    } catch (error) {
        console.error('Failed to load dashboard:', error);
    }
}

// Fetch user data (demo)
async function fetchUserData(email) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userName = email.split('@')[0];
    return {
        name: userName.charAt(0).toUpperCase() + userName.slice(1),
        email: email,
        referralCode: `${userName.toUpperCase()}2025`,
        totalDonations: Math.floor(Math.random() * 15000) + 1000,
        totalReferrals: Math.floor(Math.random() * 20) + 1,
        currentRank: Math.floor(Math.random() * 50) + 1
    };
}

// Fetch leaderboard data (demo)
async function fetchLeaderboardData() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const demoNames = ['Rahul Sharma', 'Priya Patel', 'Arjun Kumar', 'Sneha Reddy', 'Vikram Singh'];
    
    return demoNames.map((name, index) => ({
        rank: index + 1,
        name: name,
        amount: Math.floor(Math.random() * 20000) + 5000,
        referrals: Math.floor(Math.random() * 30) + 5
    })).sort((a, b) => b.amount - a.amount);
}

// Update dashboard UI
function updateDashboardUI(userData) {
    document.getElementById('internName').textContent = userData.name;
    document.getElementById('totalDonations').textContent = `₹${userData.totalDonations.toLocaleString()}`;
    document.getElementById('totalReferrals').textContent = userData.totalReferrals;
    document.getElementById('currentRank').textContent = `#${userData.currentRank}`;
    document.getElementById('referralCode').textContent = userData.referralCode;
}

// Update leaderboard
function updateLeaderboard(leaderboardData) {
    const leaderboardList = document.getElementById('leaderboardList');
    
    leaderboardList.innerHTML = leaderboardData.map(item => `
        <div class="leaderboard-item ${item.rank <= 3 ? 'top3' : ''}">
            <div class="rank">#${item.rank}</div>
            <div class="intern-info">
                <h4>${item.name}</h4>
                <p>${item.referrals} referrals</p>
            </div>
            <div class="amount">₹${item.amount.toLocaleString()}</div>
        </div>
    `).join('');
}

// Update rewards
function updateRewards(totalDonations) {
    const rewards = [
        { id: 'reward1', threshold: 1000 },
        { id: 'reward2', threshold: 5000 },
        { id: 'reward3', threshold: 10000 },
        { id: 'reward4', threshold: 25000 },
        { id: 'reward5', threshold: 5000 },
        { id: 'reward6', threshold: 15000 }
    ];
    
    rewards.forEach(reward => {
        const element = document.getElementById(reward.id);
        if (element) {
            const status = totalDonations >= reward.threshold ? 'Unlocked' : 'Locked';
            element.querySelector('.reward-status').textContent = status;
            element.classList.toggle('unlocked', status === 'Unlocked');
        }
    });
}

// Tab switching
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    
    document.getElementById(tabName === 'overview' ? 'overviewTab' : 'leaderboardTab').classList.remove('hidden');
    event.target.classList.add('active');
}

// Copy referral code
function copyReferralCode() {
    const code = document.getElementById('referralCode').textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
            showTemporaryMessage('Referral code copied!', 'success');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showTemporaryMessage('Referral code copied!', 'success');
    }
}

// Logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}

// Auth status check
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;
    
    // Redirect to login if accessing dashboard without auth
    if (currentPage.includes('dashboard.html') && !isLoggedIn) {
        window.location.href = 'index.html';
    }
}

// Loading state
function showLoading(show) {
    document.querySelectorAll('.btn').forEach(button => {
        button.disabled = show;
        if (show) {
            button.textContent = 'Loading...';
        } else {
            button.textContent = button.closest('#loginForm') ? 'Login' : 'Sign Up';
        }
    });
}

// Show messages
function showMessage(message, type) {
    document.querySelectorAll('.message').forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const container = document.querySelector('.auth-container') || document.querySelector('.dashboard');
    if (container) {
        container.insertBefore(messageDiv, container.firstChild);
        setTimeout(() => messageDiv.remove(), 5000);
    }
}

// Temporary messages
function showTemporaryMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    Object.assign(messageDiv.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '1000',
        padding: '10px 20px',
        borderRadius: '5px'
    });
    
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

// For testing - clear auth data
function clearAuthForTesting() {
    localStorage.clear();
    showMessage('Session cleared for testing!', 'success');
    setTimeout(() => window.location.href = 'index.html', 1000);
}

// Make available in console
window.clearAuthForTesting = clearAuthForTesting;