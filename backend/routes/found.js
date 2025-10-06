const express = require('express');
const FoundItem = require('../models/FoundItem');
const auth = require('../middleware/auth');
const router = express.Router();

// Create found item (protected)
router.post('/', auth, async (req, res) => {
  try {
    // Set userId from JWT token
    const foundItem = new FoundItem({
      ...req.body,
      userId: req.user.userId
    });
    await foundItem.save();
    res.status(201).json(foundItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get found items (optionally filtered)
router.get('/', async (req, res) => {
  try {
    const { districtId, venueId } = req.query;
    let filter = {};
    if (districtId) filter.districtId = districtId;
    if (venueId) filter.venueId = venueId;
    const foundItems = await FoundItem.find(filter);
    res.json(foundItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
