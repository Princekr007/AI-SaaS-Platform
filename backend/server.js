const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const testRoutes = require('./routes/testRoutes');
app.use('/api/tests', testRoutes);

console.log("🔍 MONGODB_URI:", process.env.MONGODB_URI);

// Connect to MongoDB THEN start server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB connected');
        // Start server only if DB is connected
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => console.error('❌ MongoDB error:', err));
