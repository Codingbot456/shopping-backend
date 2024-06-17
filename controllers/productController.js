// Import required modules
const { Request, Response } = require('node-fetch');
const pool = require('../config/db'); // Adjust path as per your project structure

// Constants
export const maxDuration = 500; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';

// GET function
export function GET(request) {
    return new Response('Vercel', {
        status: 200,
    });
}

// Create Product
exports.createProduct = (req, res) => {
    const { name, price, description, category_id, subcategory_id } = req.body;
    const imageUrl = req.file ? `${process.env.BASE_URL}/images/${req.file.filename}` : null;

    pool.execute(
        'INSERT INTO products (name, price, description, image_url, category_id, subcategory_id) VALUES (?, ?, ?, ?, ?, ?)',
        [name, price, description, imageUrl, category_id, subcategory_id]
    )
    .then(result => {
        res.json({ message: 'Product created successfully' });
    })
    .catch(err => {
        console.error('Error creating product:', err);
        res.status(500).json({ error: 'Database error' });
    });
};

// Get Products
exports.getProducts = (req, res) => {
    pool.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
};

// Update Product
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, price, description, category_id, subcategory_id } = req.body;
    const imageUrl = req.file ? `${process.env.BASE_URL}/images/${req.file.filename}` : null;

    pool.execute(
        'UPDATE products SET name = ?, price = ?, description = ?, image_url = ?, category_id = ?, subcategory_id = ? WHERE id = ?',
        [name, price, description, imageUrl, category_id, subcategory_id, id]
    )
    .then(result => {
        res.json({ message: 'Product updated successfully' });
    })
    .catch(err => {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'Database error' });
    });
};

// Delete Product
exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    pool.execute('DELETE FROM products WHERE id = ?', [id])
    .then(result => {
        res.json({ message: 'Product deleted successfully' });
    })
    .catch(err => {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Database error' });
    });
};

// Method to get products by category
exports.getProductsByCategory = (req, res) => {
    const categoryId = req.params.categoryId;

    pool.query('SELECT * FROM products WHERE category_id = ?', [categoryId], (err, results) => {
        if (err) {
            console.error('Error fetching products by category:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
};

// Method to get products by subcategory
exports.getProductsBySubcategoryId = (req, res) => {
    const { subcategory_id } = req.params;

    if (isNaN(subcategory_id)) {
        return res.status(400).json({ error: 'Invalid subcategory ID' });
    }

    pool.query('SELECT * FROM products WHERE subcategory_id = ?', [subcategory_id], (err, results) => {
        if (err) {
            console.error('Error fetching products by subcategory:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
};

// Method to get all products
exports.getAllProducts = (req, res) => {
    pool.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Error fetching all products:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
};

// Method to get product by ID
exports.getProductById = (req, res) => {
    const productId = req.params.id;

    pool.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product by ID:', err);
            res.status(500).json({ error: 'Database error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json(results[0]);
        }
    });
};

// Method to get products for Men category
exports.getMenProducts = (req, res) => {
    pool.query(`
        SELECT p.*
        FROM products p
        JOIN product_categories pc ON p.id = pc.product_id
        JOIN categories c ON pc.category_id = c.id
        WHERE c.name = 'Men'
    `, (err, results) => {
        if (err) {
            console.error('Error fetching Men products:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
};
