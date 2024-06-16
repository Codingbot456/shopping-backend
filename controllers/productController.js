const db = require('../config/db');

// Create Product
exports.createProduct = (req, res) => {
    const { name, price, description, category_id, subcategory_id } = req.body;
    const imageUrl = req.file ? `${process.env.BASE_URL}/images/${req.file.filename}` : null;

    db.query(
        'INSERT INTO products (name, price, description, image_url, category_id, subcategory_id) VALUES (?, ?, ?, ?, ?, ?)',
        [name, price, description, imageUrl, category_id, subcategory_id],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Database error' });
            } else {
                res.json({ message: 'Product created successfully' });
            }
        }
    );
};


// Get Products
exports.getProducts = (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error(err);
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

    db.query(
        'UPDATE products SET name = ?, price = ?, description = ?, image_url = ?, category_id = ?, subcategory_id = ? WHERE id = ?',
        [name, price, description, imageUrl, category_id, subcategory_id, id],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Database error' });
            } else {
                res.json({ message: 'Product updated successfully' });
            }
        }
    );
};


// Delete Product
exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ message: 'Product deleted successfully' });
        }
    });
};

// Method to get products by category
exports.getProductsByCategory = (req, res) => {
    const categoryId = req.params.categoryId;

    db.query('SELECT * FROM products WHERE category_id = ?', [categoryId], (err, results) => {
        if (err) {
            console.error('Error fetching products by category:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
};

exports.getProductsBySubcategoryId = (req, res) => {
    const { subcategory_id } = req.params;

    if (isNaN(subcategory_id)) {
        return res.status(400).json({ error: 'Invalid subcategory ID' });
    }

    db.query('SELECT * FROM products WHERE subcategory_id = ?', [subcategory_id], (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
};

exports.getAllProducts = (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
};

exports.getProductById = (req, res) => {
    const productId = req.params.id;
    db.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json(results[0]);
        }
    });
};

exports.getMenProducts = (req, res) => {
    const query = `
        SELECT p.*
        FROM products p
        JOIN product_categories pc ON p.id = pc.product_id
        JOIN categories c ON pc.category_id = c.id
        WHERE c.name = 'Men'
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
};
