const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { verifyAdminJWT } = require('../middleware/auth');

// ── Admin Login ───────────────────────────────────────────
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const expectedUser = process.env.ADMIN_USERNAME || 'blazefire_admin';
    const expectedPass = process.env.ADMIN_PASSWORD || 'BF@Secure2025!';

    if (username !== expectedUser || password !== expectedPass) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { username, role: 'admin' },
        process.env.ADMIN_JWT_SECRET || 'fallback_secret_change_in_prod',
        { expiresIn: '4h' }
    );

    res.json({ token, message: 'Login successful' });
});

// ── Protected Admin Routes ────────────────────────────────
router.use(verifyAdminJWT);

// Get platform stats
router.get('/stats', async (req, res) => {
    // In production: query Firestore for real stats
    res.json({
        totalUsers: 0,
        totalRevenue: 0,
        monthRevenue: 0,
        weekRevenue: 0,
        activeTournaments: 0,
        totalRegistrations: 0,
    });
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        // Requires Firebase Admin SDK — integrate after adding service account
        res.json({ users: [], message: 'Connect Firebase Admin SDK to fetch users' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get all payments
router.get('/payments', async (req, res) => {
    res.json({ transactions: [], message: 'Connect Firebase Admin SDK to fetch transactions' });
});

// Send push notification to all users
router.post('/notify', async (req, res) => {
    const { title, body, target } = req.body;
    // In production: use Firebase Admin SDK messaging.sendToTopic('all_users', {...})
    console.log(`📱 Push notification: "${title}" → ${target}`);
    res.json({ success: true, message: `Notification sent to ${target}` });
});

// Generate gift cards
router.post('/gift-card', async (req, res) => {
    const { value, quantity, expiresAt } = req.body;
    // In production: create Firestore documents for each gift card
    const codes = Array.from({ length: quantity || 1 }, () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        return `${seg()}-${seg()}-${seg()}-${seg()}`;
    });
    res.json({ success: true, codes, value, expiresAt });
});

// Create redeem code
router.post('/redeem-code', async (req, res) => {
    const code = req.body;
    // In production: save to Firestore
    res.json({ success: true, code });
});

module.exports = router;
