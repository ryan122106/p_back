const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  noteId: {
    type: Schema.Types.ObjectId,
    ref: "Note",
    required: true,
  }, // related note
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  }, // author
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = model("Comment", commentSchema);
module.exports = Comment;
