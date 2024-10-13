const express = require('express');
const dotenv = require('dotenv');
const cors  = require('cors');
const connectDB = require('./config/db');  // MongoDB connection
const chatbotRoutes = require('./routes/chatbotRoutes');


// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
// Middleware to parse JSON
app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');  // User creation route
const chatRoutes = require('./routes/chatRoutes');  // Chatbot query routes
const adminRoutes = require('./routes/adminRoutes');  // Admin view route
const testRoutes = require('./routes/testRoutes');
app.use('/api/chat', chatbotRoutes);
// Use routes
app.use('/api/users', userRoutes);  // User creation route
app.use('/api/chat', chatRoutes);  // Chatbot query route
app.use('/api/admin', adminRoutes);  // Admin view route
app.use('/api/test', testRoutes);

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'API route not found' });
});

  const server = app.listen( () => {  
    const port = server.address().port;
    console.log(`Server running locally on port ${port}`);
  });
