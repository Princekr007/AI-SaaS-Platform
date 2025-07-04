// routes/testRoutes.js
const express = require('express');
const router = express.Router();
const { generateTestSuite, getTestHistory} = require('../controllers/testController');
const TestResult = require('../models/TestResult');


router.post('/generate', generateTestSuite);

router.get('/history', async (req, res) => {
    try {
        const { page = 1, limit = 5, search = "" } = req.query;
        const query = search ? { url: { $regex: search, $options: 'i' } } : {};

        const results = await TestResult.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await TestResult.countDocuments(query);

        res.json({
            results,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});


module.exports = router;
