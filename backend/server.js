
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize } = require("./models");
const emailSetupRoutes = require("./routes/emailSetup");
const stripePaymentRoutes = require("./routes/stripePayments");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// Special handling for Stripe webhook
app.use("/api/webhook", express.raw({ type: "application/json" }));
// Regular JSON parsing for other routes
app.use(bodyParser.json());

app.use("/api/email-setup", emailSetupRoutes);
app.use("/api", stripePaymentRoutes);

app.get("/", (req, res) => {
  res.send("Backend API is running.");
});

// Add success route
app.get("/subscription-success", (req, res) => {
  res.send("Subscription successful!");
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
});
