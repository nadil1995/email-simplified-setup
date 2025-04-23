
const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Subscription = sequelize.define('Subscription', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stripeCustomerId: {
    type: DataTypes.STRING,
  },
  stripeSubscriptionId: {
    type: DataTypes.STRING,
  },
  stripePriceId: {
    type: DataTypes.STRING,
  },
  planName: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
  currentPeriodStart: {
    type: DataTypes.DATE,
  },
  currentPeriodEnd: {
    type: DataTypes.DATE,
  },
});

module.exports = Subscription;
