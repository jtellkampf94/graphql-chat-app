const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    from: { type: mongoose.Schema.ObjectId, ref: "user" },
    to: { type: mongoose.Schema.ObjectId, ref: "user" }
  },
  { timestamps: true }
);

const Post = mongoose.model("post", MessageSchema);

module.exports = Post;
