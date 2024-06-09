const mongoose = require("mongoose");

// Import the required modules

// Define the Note schema
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  userID: {
    type: String,
    ref: "User",
    required: true,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
});

// Export the Note model
module.exports = mongoose.model("Note", noteSchema);
