
const express = require("express");
const router = express.Router();
const { EmailSetup } = require("../models");

// POST /api/email-setup
router.post("/", async (req, res) => {
  const { domain, provider, emailName, addUsers } = req.body;
  if (!domain || !provider || !emailName) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  try {
    const setupEntry = await EmailSetup.create({ domain, provider, emailName, addUsers });
    res.status(201).json(setupEntry);
  } catch (error) {
    res.status(500).json({ error: "Failed to save email setup." });
  }
});

// GET /api/email-setup
router.get("/", async (req, res) => {
  try {
    const entries = await EmailSetup.findAll();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch records." });
  }
});

module.exports = router;
