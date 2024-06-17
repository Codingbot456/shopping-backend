const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration
const allowedOrigins = [
    'https://eccomerce-fronted.vercel.app',
    'http://localhost:3000'
]; // Add additional origins as needed

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200 // For legacy browser support
}));

app.options('*', cors()); // Preflight OPTIONS request handling
// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const apiRouter = require('./routes/api');
const orderRoutes = require('./routes/orderRoutes');
const searchRoutes = require('./routes/searchRoutes');

app.use('/api/products', productRoutes); // Adjust according to your route structure
app.use('/api/auth', authRoutes); // Adjust according to your route structure
app.use('/api/orders', orderRoutes); // Adjust according to your route structure
app.use('/api/search', searchRoutes); // Adjust according to your route structure
app.use('/api', apiRouter); // Adjust according to your route structure

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
