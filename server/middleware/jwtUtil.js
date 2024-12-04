const jwt = require("jsonwebtoken");

const generateJWT = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    username: user.username,
  };

  const options = {
    expiresIn: "1d", // Token expires in 1 day
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

module.exports = generateJWT;
