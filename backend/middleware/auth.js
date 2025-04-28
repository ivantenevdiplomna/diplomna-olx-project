const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            console.log('No token provided in request');
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set in environment variables');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded successfully:', decoded);
        
        if (!decoded.userId) {
            console.log('Token does not contain userId');
            return res.status(401).json({ message: 'Invalid token format' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        res.status(500).json({ message: 'Authentication error', error: error.message });
    }
}; 