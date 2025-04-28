const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get all chats for a user
router.get('/', auth, async (req, res) => {
    try {
        const chats = await Chat.find({
            $or: [{ buyer: req.user.userId }, { seller: req.user.userId }]
        })
        .populate('product', 'title image price')
        .populate('buyer', 'name email')
        .populate('seller', 'name email')
        .populate('messages.sender', 'name')
        .sort('-updatedAt');

        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chats', error: error.message });
    }
});

// Get a specific chat
router.get('/:id', auth, async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id)
            .populate('product', 'title image price')
            .populate('buyer', 'name email')
            .populate('seller', 'name email')
            .populate('messages.sender', 'name');

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Check if user is part of the chat
        if (chat.buyer._id.toString() !== req.user.userId && 
            chat.seller._id.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to view this chat' });
        }

        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat', error: error.message });
    }
});

// Start a new chat
router.post('/', auth, async (req, res) => {
    try {
        const { productId } = req.body;
        
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user is not the seller
        if (product.seller.toString() === req.user.userId) {
            return res.status(400).json({ message: 'Cannot start chat with yourself' });
        }

        // Check if chat already exists
        const existingChat = await Chat.findOne({
            product: productId,
            buyer: req.user.userId
        });

        if (existingChat) {
            const populatedChat = await Chat.findById(existingChat._id)
                .populate('product', 'title image price')
                .populate('buyer', 'name email')
                .populate('seller', 'name email')
                .populate('messages.sender', 'name');
            return res.json(populatedChat);
        }

        const chat = new Chat({
            product: productId,
            buyer: req.user.userId,
            seller: product.seller
        });

        await chat.save();

        const populatedChat = await Chat.findById(chat._id)
            .populate('product', 'title image price')
            .populate('buyer', 'name email')
            .populate('seller', 'name email')
            .populate('messages.sender', 'name');

        res.status(201).json(populatedChat);
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(400).json({ message: 'Error creating chat', error: error.message });
    }
});

// Add a message to a chat
router.post('/:id/messages', auth, async (req, res) => {
    try {
        const { text } = req.body;
        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Check if user is part of the chat
        if (chat.buyer.toString() !== req.user.userId && 
            chat.seller.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to send messages in this chat' });
        }

        chat.messages.push({
            sender: req.user.userId,
            text
        });

        await chat.save();

        const updatedChat = await Chat.findById(chat._id)
            .populate('product', 'title image price')
            .populate('buyer', 'name email')
            .populate('seller', 'name email')
            .populate('messages.sender', 'name');

        res.status(201).json(updatedChat);
    } catch (error) {
        res.status(400).json({ message: 'Error adding message', error: error.message });
    }
});

// Update chat status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Check if user is part of the chat
        if (chat.buyer.toString() !== req.user.userId && 
            chat.seller.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this chat' });
        }

        chat.status = status;
        await chat.save();

        const updatedChat = await Chat.findById(chat._id)
            .populate('product', 'title image price')
            .populate('buyer', 'name email')
            .populate('seller', 'name email')
            .populate('messages.sender', 'name');

        res.json(updatedChat);
    } catch (error) {
        res.status(400).json({ message: 'Error updating chat status', error: error.message });
    }
});

module.exports = router; 