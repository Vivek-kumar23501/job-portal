const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'employer'] },
  token: String,
  createdAt: { type: Date, default: Date.now, expires: 600 } // expires in 10 min
});

module.exports = mongoose.model('PendingUser', pendingUserSchema);
