const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // used as email
  password: { type: String, required: true },
  name: { type: String },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
