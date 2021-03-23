const User = require("../models/user");

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

      try {
        // Validate input

        // Create User
        const user = new User({ username, email, password });
        await user.save();
        return user;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  }
};

module.exports = resolvers;
