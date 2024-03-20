// userModel.js
import mongoose from 'mongoose';

const User = mongoose.model('User', {
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'moderator'],
    default: 'user',
  },
});

export default User;
