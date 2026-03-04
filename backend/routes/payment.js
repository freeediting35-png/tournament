const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// ── Create Fampay Order ──────────────────────────────────
router.post('/create-order', async (req, res) => {
    const { amount, userId, tournamentId } = req.body;

    if (!amount || !userId || !tournamentId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const orderId = `BF_${Date.now()}_${userId.slice(0, 6)}`;

    try {
        // When real Fampay credentials are available, uncomment:
        /*
        const response = await fetch('https://api.fampay.in/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.FAMPAY_API_KEY,
            'x-merchant-id': process.env.FAMPAY_MERCHANT_ID,
          },
          body: JSON.stringify({
            order_id: orderId,
            amount: amount * 100,
            description: `BlazeFire Arena - Tournament Entry ${tournamentId}`,
            merchant_account: process.env.FAMPAY_ACCOUNT_ID,
            redirect_url: `${process.env.FRONTEND_URL}/payment/success`,
            webhook_url: `${process.env.BACKEND_URL}/api/payment/webhook`,
            metadata: { userId, tournamentId },
          }),
        });
        const data = await response.json();
        return res.json({ orderId: data.order_id, paymentUrl: data.payment_url });
        */

        // Mock response for development
        res.json({
            orderId,
            paymentUrl: `https://fampay.in/pay/${orderId}`,
            message: 'Order created (development mode)',
        });
    } catch (err) {
        console.error('Fampay error:', err);
        res.status(500).json({ error: 'Failed to create payment order' });
    }
});

// ── Payment Status Check ─────────────────────────────────
router.get('/status/:orderId', async (req, res) => {
    const { orderId } = req.params;
    // Mock: in production, query Fampay API for real status
    res.json({ status: 'PENDING', orderId });
});

// ── Fampay Webhook (called by Fampay when payment completes) ──
router.post('/webhook', async (req, res) => {
    const { order_id, status, metadata } = req.body;
    // Verify signature in production using FAMPAY_WEBHOOK_SECRET
    if (status === 'PAID' && metadata) {
        const { userId, tournamentId } = metadata;
        console.log(`✅ Payment confirmed: Order ${order_id} | User ${userId} | Tournament ${tournamentId}`);
        // In production: update Firestore registration status, send FCM notification
    }
    res.json({ success: true });
});

// ── Verify Gift Card ──────────────────────────────────────
router.post('/verify-gift-card', async (req, res) => {
    const { code } = req.body;
    // Firestore validation done on client for now; backend provides additional validation
    if (!code || code.length < 10) {
        return res.status(400).json({ valid: false, message: 'Invalid gift card format' });
    }
    res.json({ valid: true, message: 'Code format valid' });
});

// ── Verify Redeem Code ────────────────────────────────────
router.post('/verify-redeem', async (req, res) => {
    const { code, tournamentId, entryFee } = req.body;
    if (!code) {
        return res.status(400).json({ valid: false, message: 'Code is required' });
    }
    // Basic validation — full validation handled by frontend Firestore query
    res.json({ valid: true, message: 'Code format valid' });
});

// ── Wallet Deduct ─────────────────────────────────────────
router.post('/wallet-deduct', async (req, res) => {
    const { userId, amount } = req.body;
    // In production: atomic Firestore transaction to deduct wallet balance
    res.json({ success: true, message: `₹${amount} deducted from wallet` });
});

module.exports = router;
