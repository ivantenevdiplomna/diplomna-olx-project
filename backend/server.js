const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/olx-clone', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const chatRoutes = require('./routes/chats');
const adminRoutes = require('./routes/admin');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/admin', adminRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('OLX Clone Backend is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', {
        message: err.message,
        stack: err.stack,
        name: err.name
    });
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 