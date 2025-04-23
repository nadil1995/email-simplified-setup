
const express = require('express');
const router = express.Router();
const checkoutRoutes = require('./checkout');
const subscriptionStatusRoutes = require('./subscriptionStatus');
const webhookRoutes = require('./webhooks');

router.use('/', checkoutRoutes);
router.use('/', subscriptionStatusRoutes);
router.use('/', webhookRoutes);

module.exports = router;
