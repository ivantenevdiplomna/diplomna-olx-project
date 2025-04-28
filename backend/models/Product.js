const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['vehicles', 'property', 'electronics', 'fashion', 'home', 'jobs', 'services']
    },
    subcategory: {
        type: String,
        required: [true, 'Subcategory is required']
    },
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'pending'],
        default: 'available'
    },
    comments: [commentSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for better search performance
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ subcategory: 1 });
productSchema.index({ seller: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 