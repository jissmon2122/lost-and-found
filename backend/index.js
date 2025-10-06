const express = require('express');
const connectDB = require('./db');
const founderRoutes = require('./routes/founder');
const authRoutes = require('./routes/auth');
const foundRoutes = require('./routes/found');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' })); // or higher if needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

connectDB();

app.use('/api/founder', founderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/found', foundRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
