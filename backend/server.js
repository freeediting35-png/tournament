require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60,
    message: { error: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

// ── Routes ────────────────────────────────────────────────
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payment');
const tournamentRoutes = require('./routes/tournament');

app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/tournaments', tournamentRoutes);

// ── Health check ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', platform: 'BlazeFire Arena', version: '1.0.0' });
});

// ── Error handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🔥 BlazeFire Arena Backend running on port ${PORT}`);
    });
}


module.exports = app;
