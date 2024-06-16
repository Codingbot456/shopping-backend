
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const favicon = require('serve-favicon');
const app = express();
const PORT = 4000;

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const apiRouter = require('./routes/api');
const orderRoutes = require('./routes/orderRoutes');
const searchRoutes = require('./routes/searchRoutes');


  

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use('/api', productRoutes);
app.use('/api', authRoutes);
app.use('/', apiRouter);
app.use('/api/orders', orderRoutes);
app.use('/api', searchRoutes);

// Add more protected routes as needed

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
