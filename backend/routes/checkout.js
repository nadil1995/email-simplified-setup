
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getOrCreateCustomer } = require('../utils/stripeCustomer');

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId, planName } = req.body;
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = Buffer.from(token, 'base64').toString().split(':')[0];
    
    if (!userId) {
      return res.status(401).json({ error: 'Invalid authentication' });
    }

    const customer = await getOrCreateCustomer(userId, userId + '@example.com');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.DOMAIN}/subscription-success`,
      cancel_url: `${process.env.DOMAIN}/pricing`,
      metadata: {
        userId,
        planName,
      },
    });

    res.json({ sessionUrl: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
