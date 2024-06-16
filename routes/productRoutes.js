const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Log the methods to ensure they are not undefined
console.log('productController.getAllProducts:', productController.getAllProducts);
console.log('productController.getProductById:', productController.getProductById);
console.log('productController.createProduct:', productController.createProduct);
console.log('productController.updateProduct:', productController.updateProduct);
console.log('productController.deleteProduct:', productController.deleteProduct);
console.log('productController.getMenProducts:', productController.getMenProducts);

router.get('/products/category/:categoryId', productController.getProductsByCategory);
router.get('/products/subcategory/:subcategory_id', productController.getProductsBySubcategoryId);
router.get('/products/:id', productController.getProductById);
router.get('/products', productController.getProducts); 
router.post('/products', upload.single('image'), productController.createProduct);
router.put('/products/:id', upload.single('image'), productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.get('/men-products', productController.getMenProducts);

module.exports = router;
