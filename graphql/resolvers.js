const User = require("../models/user");
const { UserInputError } = require("apollo-server");

const resolvers = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.find();
        return users;
      } catch (error) {
        console.log(error);
      }
    }
  },
  Mutation: {
    register: async (parent, args, ctx, info) => {
      const { username, email, password, confirmPassword } = args;
      let errors = {};

      try {
        // Validate input
        if (email.trim() === "") errors.email = "Email must not be empty";
        if (username.trim() === "")
          errors.username = "Username must not be empty";
        if (password.trim() === "")
          errors.password = "Password must not be empty";
        if (confirmPassword.trim() === "")
          errors.confirmPassword = "Confirm password must not be empty";

        if (password !== confirmPassword)
          errors.confirmPassword = "Passwords must match";
        // Check if username or email is unique
        const userByEmail = await User.find({ email });
        const userByUsername = await User.find({ username });

        if (userByUsername.length > 0) errors.username = "Username is taken";
        if (userByEmail.length > 0) errors.email = "Email is taken";

        if (Object.keys(errors).length > 0) {
          throw errors;
        }
        // Create User
        const user = new User({ username, email, password });
        await user.save();
        return user;
      } catch (error) {
        console.log(error);
        throw new UserInputError("Bad input", { errors: error });
      }
    }
  }
};

module.exports = resolvers;
