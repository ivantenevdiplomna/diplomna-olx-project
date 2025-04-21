const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all products with pagination and filtering
router.get('/', async (req, res) => {
    try {
        const { category, page = 1, limit = 10, search, sort = '-createdAt' } = req.query;
        
        const query = {};
        if (category) query.category = category;
        if (search) {
            query.$text = { $search: search };
        }

        const products = await Product.find(query)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('seller', 'name email phoneNumber')
            .populate('comments.user', 'name email')
            .exec();

        const count = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category })
            .populate('seller', 'name email phoneNumber')
            .populate('comments.user', 'name email')
            .sort('-createdAt');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products by category', error: error.message });
    }
});

// Get a single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('seller', 'name email phoneNumber')
            .populate('comments.user', 'name email');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});

// Create a new product
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, description, price, category } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const product = new Product({
            title,
            description,
            price,
            category,
            image: req.file.path,
            seller: req.user.userId
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Error creating product', error: error.message });
    }
});

// Add a comment to a product
router.post('/:id/comments', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const comment = {
            text: req.body.text,
            user: req.user.userId
        };

        product.comments.push(comment);
        await product.save();

        const updatedProduct = await Product.findById(req.params.id)
            .populate('seller', 'name email phoneNumber')
            .populate('comments.user', 'name email');

        res.status(201).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error adding comment', error: error.message });
    }
});

// Update a product
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the user is the seller
        if (product.seller.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        const updateData = {
            ...req.body,
            ...(req.file && { image: req.file.path })
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        )
        .populate('seller', 'name email phoneNumber')
        .populate('comments.user', 'name email');

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error updating product', error: error.message });
    }
});

// Delete a product
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the user is the seller
        if (product.seller.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        await product.remove();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

module.exports = router; 