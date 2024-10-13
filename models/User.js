const mongoose = require('mongoose');

// Define User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },  // Ensure username is required and unique
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to automatically assign usernames like 'user1', 'user2', etc.
UserSchema.pre('save', async function(next) {
  const user = this;

  // Only generate a username if it's a new user
  if (!user.isNew) return next();

  try {
    // Find the last user created and increment the username
    const lastUser = await mongoose.model('User').findOne().sort({ createdAt: -1 });

    let nextNumber = 1;  // Start with 'user1' if no users exist
    if (lastUser) {
      // Extract the last number and increment it
      const lastNumber = parseInt(lastUser.username.replace('user', '')) || 0;
      nextNumber = lastNumber + 1;
    }

    // Assign the new username in the format 'userX'
    user.username = `user${nextNumber}`;
    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model('User', UserSchema);
