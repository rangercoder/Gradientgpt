const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');  // MongoDB connection
const chatbotRoutes = require('./routes/chatbotRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');  // User creation route
const chatRoutes = require('./routes/chatRoutes');  // Chatbot query routes
const adminRoutes = require('./routes/adminRoutes');  // Admin view route

// Use routes
app.use('/api/chat', chatbotRoutes);
app.use('/api/users', userRoutes);  // User creation route
app.use('/api/chat', chatRoutes);  // Chatbot query route
app.use('/api/admin', adminRoutes);  // Admin view route

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'API route not found' });
});

// Export the app for Vercel to handle the port and server

if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(0, () => {  // '0' tells Node.js to assign a random available port
    const port = server.address().port;
    console.log(`Server running locally on port ${port}`);
  });
} else {
  // In production (Vercel), the port is automatically managed by Vercel
  module.exports = app;  // Export the app for Vercel
}

