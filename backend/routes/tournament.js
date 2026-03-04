const express = require('express');
const router = express.Router();

// GET /api/tournaments — list all (Firestore reads happen on frontend via SDK)
router.get('/', (req, res) => {
    res.json({ message: 'Use Firestore SDK directly from frontend for real-time tournament data.' });
});

// POST /api/tournaments/:id/register
router.post('/:id/register', async (req, res) => {
    const { id } = req.params;
    const registration = req.body;
    // In production: server-side validation before writing to Firestore
    // 1. Verify Firebase ID token
    // 2. Check slot availability
    // 3. Write registration atomically
    res.json({ success: true, message: 'Registration processed via Firestore on client' });
});

module.exports = router;
