const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const apiRouter = require('./routes/api');
const orderRoutes = require('./routes/orderRoutes');
const searchRoutes = require('./routes/searchRoutes');

// CORS configuration
const corsOptions = {
    origin: 'https://eccomerce-fronted.vercel.app',
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions)); // CORS should be applied before other middleware
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use('/api', productRoutes);
app.use('/api', authRoutes);
app.use('/', apiRouter);
app.use('/api/orders', orderRoutes);
app.use('/api', searchRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
