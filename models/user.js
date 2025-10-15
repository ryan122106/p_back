const { Schema, model } = require("mongoose");

/*
    Fields:
    -name
    -email
    -password
    -role
*/

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // ensure the email entered is unique
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"], // enum is to control the value for role
    default: "user",
  },
  isBlocked: {
    type: Boolean,
    default: false, // false = active, true = blocked
  },
});

const User = model("user", userSchema);
module.exports = User;
