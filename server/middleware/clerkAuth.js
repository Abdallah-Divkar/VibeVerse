const { Clerk } = require('@clerk/clerk-sdk-node');

const clerkAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing.' });
  }

  const token = authHeader.split(' ')[1]; // Extract token

  try {
    const user = await Clerk.authenticateRequest({ authorization: token });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
    }

    req.user = user; // Attach user data
    next();
  } catch (error) {
    console.error('Clerk Authentication Error:', error.message);
    return res.status(401).json({ message: 'Failed to authenticate user.' });
  }
};

module.exports = clerkAuthMiddleware;
