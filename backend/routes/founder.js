const express = require('express');
const Founder = require('../models/Founder');
const auth = require('../middleware/auth');
const router = express.Router();

// Create founder (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, company } = req.body;
    const founder = new Founder({ name, email, company });
    await founder.save();
    res.status(201).json(founder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all founders (protected)
router.get('/', auth, async (req, res) => {
  try {
    const founders = await Founder.find();
    res.json(founders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
