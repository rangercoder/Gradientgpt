const mongoose = require('mongoose');

// Define User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },  
  createdAt: { type: Date, default: Date.now }
});


UserSchema.pre('save', async function(next) {
  const user = this;

  
  if (!user.isNew) return next();

  try {
  
    const lastUser = await mongoose.model('User').findOne().sort({ createdAt: -1 });

    let nextNumber = 1;  
    if (lastUser) {
     
      const lastNumber = parseInt(lastUser.username.replace('user', '')) || 0;
      nextNumber = lastNumber + 1;
    }

    
    user.username = `user${nextNumber}`;
    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model('User', UserSchema);
