const express = require('express');
const dotenv = require('dotenv');
const cors  = require('cors');
const connectDB = require('./config/db');  
const chatbotRoutes = require('./routes/chatbotRoutes');
const savedConversationRoutes = require('./routes/savedConversationRoutes');



dotenv.config();


connectDB();

const app = express();
app.use(cors());

app.use(express.json());


const userRoutes = require('./routes/userRoutes'); 
const adminRoutes = require('./routes/adminRoutes');  
const testRoutes = require('./routes/testRoutes');
app.use('/api/chat', chatbotRoutes);

app.use('/api/users', userRoutes);  
app.use('/api/admin', adminRoutes);  
app.use('/api/test', testRoutes);
app.use('/api/savedConversations', savedConversationRoutes);  


app.use((req, res, next) => {
  res.status(404).json({ message: 'API route not found' });
});

  const server = app.listen( () => {  
    const port = server.address().port;
    console.log(`Server running locally on port ${port}`);
  });
