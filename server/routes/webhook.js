// routes/webhook.js
const express = require('express');
const { handleWebhookEvent, verifyWebhookSignature } = require('../controllers/webhook.controller');
const router = express.Router();

// Add the webhook signature verification middleware
router.post('/', verifyWebhookSignature, async (req, res) => {
  const event = req.body;

  try {
    await handleWebhookEvent(event); // Process the event
    res.status(200).send('Event processed successfully');
  } catch (error) {
    console.error('Error processing webhook event:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
