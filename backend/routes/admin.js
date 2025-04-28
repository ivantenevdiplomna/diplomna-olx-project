const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Get all users (admin only)
router.get('/users', auth, adminAuth, async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// Get all products with seller details (admin only)
router.get('/products', auth, adminAuth, async (req, res) => {
    try {
        const products = await Product.find()
            .populate('seller', 'name email phoneNumber')
            .sort('-createdAt');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// Delete user (admin only)
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

// Delete product (admin only)
router.delete('/products/:id', auth, adminAuth, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

// Get dashboard stats (admin only)
router.get('/stats', auth, adminAuth, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const recentProducts = await Product.find()
            .sort('-createdAt')
            .limit(5)
            .populate('seller', 'name email');
        
        res.json({
            totalUsers,
            totalProducts,
            recentProducts
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
});

module.exports = router; 