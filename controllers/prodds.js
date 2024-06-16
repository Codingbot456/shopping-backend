const db = require('../config/db'); // Adjust the path to your db connection module

// Create Product
exports.createProduct = (req, res) => {
    const { name, price, description, category_id, subcategory_id } = req.body;
    const imageUrl = req.file ? `/images/${req.file.filename}` : null;

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
    const imageUrl = req.file ? `/images/${req.file.filename}` : null;

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
