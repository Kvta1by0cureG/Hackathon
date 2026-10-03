// backend/src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phone:      { type: String, required: true, unique: true },
  name:       { type: String, default: '' },
  score:      { type: Number, default: 0 },
  floor:      { type: Number, default: 1 },
  lastMessageAt: { type: Date, default: null }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);