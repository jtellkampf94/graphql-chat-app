const mongoose = require("mongoose");

const ReactionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    messageId: { type: mongoose.Schema.ObjectId, ref: "post" },
    userId: { type: mongoose.Schema.ObjectId, ref: "user" }
  },
  { timestamps: true }
);

const Reaction = mongoose.model("reaction", ReactionSchema);

module.exports = Reaction;
