const jwt = require('jsonwebtoken');

// Middleware to verify the token and authenticate the user
const requireAuth = (req, res, next) => {
    const token = req.header('Authorization');  // Authorization header should include 'Bearer <token>'

    if (!token) {
        return res.status(403).json({ message: "No token, access denied." });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET); // Split to get the token part
        req.auth = { userId: decoded.userId }; // Attach user ID to req.auth
        next();  // Continue to the next middleware or route handler
    } catch (err) {
        return res.status(403).json({ message: "Token is not valid." });
    }
};

module.exports = { requireAuth };  // Export the required middleware
