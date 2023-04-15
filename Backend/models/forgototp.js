const mongoose = require("mongoose");

const forgototpSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: Date.now() + 5 * 60 * 1000, // 5 minutes from now
  },
});

module.exports = mongoose.model("forgototp", forgototpSchema);