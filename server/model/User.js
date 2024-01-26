const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  blogs: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Blog",
      },
    ],
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
