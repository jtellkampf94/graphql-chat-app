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
  }
};

module.exports = resolvers;
