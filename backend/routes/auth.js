const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup route
router.post('/signup', async (req, res) => {
    try {
        console.log('Signup request received:', JSON.stringify(req.body, null, 2));
        
        const { email, password, name } = req.body;

        // Validate required fields
        if (!email || !password || !name) {
            console.log('Missing required fields:', { email, name, hasPassword: !!password });
            return res.status(400).json({ 
                message: 'Missing required fields',
                required: ['email', 'password', 'name']
            });
        }

        // Check if user already exists
        console.log('Checking for existing user with email:', email);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists with email:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        console.log('Creating new user...');
        const user = new User({
            email,
            password,
            name
        });

        console.log('Saving new user to database...');
        await user.save();
        console.log('User saved successfully:', { id: user._id, email: user.email });

        // Generate JWT token
        console.log('Generating JWT token...');
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        console.log('Signup successful, sending response...');
        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Signup error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({ 
            message: 'Error creating user', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Error during login', 
            error: error.message 
        });
    }
});

module.exports = router; 