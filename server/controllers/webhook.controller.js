// controllers/webhook.controller.js
const User = require('../models/User');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

// Webhook Secret key from Clerk Dashboard
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

const handleWebhookEvent = async (event) => {
  switch (event.type) {
    case 'user.created':
      // Handle user creation logic
      console.log('New User Created:', event.data);
      break;
    case 'user.updated':
      // Handle user update logic
      console.log('User Updated:', event.data);
      break;
    case 'user.deleted':
      // Handle user deletion logic
      console.log('User Deleted:', event.data);
      break;
    default:
      console.log('Unhandled event type:', event.type);
  }
};

// Verify webhook signature to ensure authenticity
const verifyWebhookSignature = (req, res, next) => {
  const signature = req.headers['clerk-signature'];
  const body = JSON.stringify(req.body);

  const hash = crypto
    .createHmac('sha256', CLERK_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  if (signature !== hash) {
    return res.status(403).send('Invalid signature');
  }

  next();
};

module.exports = {
  handleWebhookEvent,
  verifyWebhookSignature,
};
