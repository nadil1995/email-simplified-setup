
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize } = require("./models");
const emailSetupRoutes = require("./routes/emailSetup");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/email-setup", emailSetupRoutes);

app.get("/", (req, res) => {
  res.send("Backend API is running.");
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
});
