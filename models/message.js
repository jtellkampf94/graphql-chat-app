const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    from: { type: mongoose.Schema.ObjectId, ref: "user" },
    to: { type: mongoose.Schema.ObjectId, ref: "user" },
    reactions: [{ type: mongoose.Schema.ObjectId, ref: "reaction" }]
  },
  { timestamps: true }
);

const Post = mongoose.model("post", MessageSchema);

module.exports = Post;
