const express = require('express');
const mysql = require('mysql');
const  cors=require('cors')

const app = express();
app.use(cors());
const PORT = 4000;

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecommerce'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Define route to fetch products for "Men" category
app.get('/men', (req, res) => {
    const query = `
    SELECT p.*
    FROM products p
    JOIN product_categories pc ON p.id = pc.product_id
    WHERE pc.category_id IN (
      SELECT id FROM categories WHERE name = 'Men'
    )
  `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});