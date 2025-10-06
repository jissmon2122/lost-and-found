// Script to update all users in MongoDB with default name and phone fields
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

async function updateUsers() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const users = await User.find({});
  for (const user of users) {
    if (!user.name) user.name = 'Unknown';
    if (!user.phone) user.phone = 'N/A';
    await user.save();
  }
  console.log('All users updated with name and phone fields.');
  process.exit(0);
}

updateUsers();
