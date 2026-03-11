const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try {
        const { rows: settings } = await pool.query('SELECT * FROM Settings WHERE id = 1');
        res.json(settings[0] || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/', protect, admin, async (req, res) => {
    const { facebook_url, instagram_url, whatsapp_number, tiktok_url, store_phone, store_email, store_address } = req.body;
    try {
        await pool.query(
            `UPDATE Settings SET 
       facebook_url = $1, instagram_url = $2, whatsapp_number = $3, tiktok_url = $4,
       store_phone = $5, store_email = $6, store_address = $7
       WHERE id = 1`,
            [facebook_url, instagram_url, whatsapp_number, tiktok_url, store_phone, store_email, store_address]
        );
        res.json({ message: 'Settings updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
