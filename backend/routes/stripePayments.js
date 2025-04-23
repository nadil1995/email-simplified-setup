
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../models/Subscription');

// Create a checkout session for subscription
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId, planName } = req.body;
    
    // Get user from auth header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = Buffer.from(token, 'base64').toString().split(':')[0];
    
    if (!userId) {
      return res.status(401).json({ error: 'Invalid authentication' });
    }

    // Check if customer exists
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: userId + '@example.com',
      limit: 1,
    });
    
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: userId + '@example.com',
        metadata: {
          userId,
        },
      });
    }

    // Create checkout session
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

// Get subscription status
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

    // Check current status in Stripe if we have a subscription ID
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

// Handle Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      
      if (session.mode === 'subscription') {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        
        await Subscription.create({
          userId: session.metadata.userId,
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          stripePriceId: subscription.items.data[0].price.id,
          planName: session.metadata.planName,
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        });
      }
      break;
    }
    
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      
      if (invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        
        await Subscription.update(
          {
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
          {
            where: { stripeSubscriptionId: invoice.subscription },
          }
        );
      }
      break;
    }
    
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      
      await Subscription.update(
        {
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
        {
          where: { stripeSubscriptionId: subscription.id },
        }
      );
      break;
    }
  }

  res.json({ received: true });
});

module.exports = router;
