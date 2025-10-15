const { Schema, model } = require("mongoose");

const feedbackSchema = new Schema({
  user: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: { type: Number, default: 0 }, 
});

const Feedback = model("Feedback", feedbackSchema);

module.exports = Feedback;
