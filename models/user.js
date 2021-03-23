const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: "Username already exists",
      required: "Username is required"
    },
    email: {
      type: String,
      unique: "Email already exists",
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
      required: "Email is required"
    }
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);

module.exports = User;
