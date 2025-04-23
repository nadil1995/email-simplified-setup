
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../models/Subscription');

router.get('/subscription-status', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = Buffer.from(token, 'base64').toString().split(':')[0];
    
    if (!userId) {
      return res.status(401).json({ error: 'Invalid authentication' });
    }

    const subscription = await Subscription.findOne({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    if (!subscription) {
      return res.json({ active: false });
    }

    if (subscription.stripeSubscriptionId) {
      const stripeSubscription = await stripe.subscriptions.retrieve(
        subscription.stripeSubscriptionId
      );
      
      await subscription.update({
        status: stripeSubscription.status,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      });

      return res.json({
        active: stripeSubscription.status === 'active',
        planName: subscription.planName,
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        status: stripeSubscription.status,
      });
    }

    return res.json({
      active: subscription.status === 'active',
      planName: subscription.planName,
      currentPeriodEnd: subscription.currentPeriodEnd,
      status: subscription.status,
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
