const User = require("../models/user");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");

const resolvers = {
  Query: {
    getUsers: async (parent, args, ctx, info) => {
      try {
        const { user } = ctx;
        if (!user) throw new AuthenticationError("Unauthenticated");

        const users = await User.find({ _id: { $ne: user.id } });
        return users;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    login: async (parent, args, ctx, info) => {
      const { username, password } = args;
      let errors = {};
      try {
        // Validate input
        if (username.trim() === "")
          errors.username = "Username must not be empty";
        if (password === "") errors.password = "Password must not be empty";

        if (Object.keys(errors).length > 0)
          throw new UserInputError("Bad input", { errors });
        // Find user
        const user = await User.findOne({
          username
        });

        if (!user) {
          errors.username = "User not found";
          throw new UserInputError("user not found", { errors });
        }

        // Check if password is correct
        if (!user.authenticate(password)) {
          errors.password = "Password incorrect";
          throw new UserInputError("password incorrect", { errors });
        }

        const token = jwt.sign(
          {
            id: user._id
          },
          process.env.JWT_SECRET,
          { expiresIn: 6 * 60 * 60 }
        );

        return {
          ...user.toJSON(),
          id: user._id,
          createdAt: user.createdAt.toISOString(),
          token
        };
      } catch (error) {
        console.log(error);
        throw error;
        // throw new UserInputError("Bad input", { errors: error });
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
        if (password === "") errors.password = "Password must not be empty";
        if (confirmPassword === "")
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
