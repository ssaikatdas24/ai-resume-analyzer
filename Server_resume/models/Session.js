// const mongoose = require('mongoose');
import mongoose from 'mongoose'; // <--- CHANGE: Use import

const suggestionSchema = new mongoose.Schema({
  oldBullet: String,
  newBullet: String,
  reason: String,
});

const sessionSchema = new mongoose.Schema({
  resumeText: { type: String, required: true },
  jobDescription: { type: String, required: true },
  parsedSections: {
    type: Map,
    of: String,
  },
  keywords: {
    resumeKeywords: [String],
    jdKeywords: [String],
  },
  scores: {
    overall: Number,
    skills: Number,
    experience: Number,
  },
  suggestions: [suggestionSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// module.exports = mongoose.model('Session', sessionSchema);
export default mongoose.model('Session', sessionSchema);