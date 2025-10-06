const mongoose = require('mongoose');

const FoundItemSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  districtId: { type: String, required: true },
  venueId: { type: String, required: true },
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  dateFound: { type: String, required: true },
  photos: [{ type: String }],
  securityQuestions: [
    {
      questionId: String,
      answer: String
    }
  ],
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FoundItem', FoundItemSchema);
