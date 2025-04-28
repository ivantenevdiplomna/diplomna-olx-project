const User = require('../models/User');

const adminAuth = async (req, res, next) => {
    try {
        // Check if user exists and is authenticated (assuming auth middleware runs before this)
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Check if user is admin
        const user = await User.findById(req.user.userId);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = adminAuth; 