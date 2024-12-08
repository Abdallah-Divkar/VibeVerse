const jwt = require('jsonwebtoken');

const generateJWT = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables.');
  }

  const payload = {
    _id: user._id,
    email: user.email,
    username: user.username,
  };

  const options = {
    expiresIn: process.env.JWT_EXPIRATION || '1d', // Fallback to 1 day
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

module.exports = generateJWT;
