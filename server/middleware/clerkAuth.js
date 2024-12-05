const { Clerk } = require('@clerk/clerk-sdk-node');

const clerkAuthMiddleware = async (req, res, next) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from the 'Bearer' prefix

    // Verify the token using Clerk SDK
    const user = await Clerk.authenticateRequest({ 
      authorization: token 
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Attach user data to the request object
    req.user = user;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = clerkAuthMiddleware;
