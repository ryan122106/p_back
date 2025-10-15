const { Schema, model } = require("mongoose");

const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  media: [
    {
      type: String,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Note = model("Note", noteSchema);
module.exports = Note;
