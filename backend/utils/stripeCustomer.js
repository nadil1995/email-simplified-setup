
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const getOrCreateCustomer = async (userId, userEmail) => {
  const existingCustomers = await stripe.customers.list({
    email: userEmail,
    limit: 1,
  });
  
  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  return stripe.customers.create({
    email: userEmail,
    metadata: {
      userId,
    },
  });
};

module.exports = {
  getOrCreateCustomer,
};
