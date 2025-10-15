const { Schema, model } = require("mongoose");

const likeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  itemId: {
    type: Schema.Types.ObjectId,
    required: true,
  }, 
  itemType: {
    type: String,
    enum: ["note", "comment", "feedback"],
    required: true,
  },

});

const Like = model("Like", likeSchema);
module.exports = Like;
