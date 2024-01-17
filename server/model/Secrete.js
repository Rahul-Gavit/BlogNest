const mongoose = require("mongoose");
const { Schema } = mongoose;

const secretSchema = new Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Secrete = mongoose.model("Secrete", secretSchema);

module.exports = Secrete;
