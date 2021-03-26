const User = require("../../models/user");
const Message = require("../../models/message");
const { UserInputError, AuthenticationError } = require("apollo-server");

const resolvers = {
  Mutation: {
    sendMessage: async (parent, args, ctx, info) => {
      try {
        const { user } = ctx;
        if (!user) throw new AuthenticationError("Unauthenticated");

        const { to, content } = args;
        const recipient = await User.findById(to);

        if (!recipient) {
          throw new UserInputError("User not found");
        } else if (recipient._id.toString() === user.id.toString()) {
          throw new UserInputError("You can't message yourself");
        }

        if (content.trim() === "") throw new UserInputError("Message is Empty");

        const message = new Message({ content, from: user.id, to });
        await message.save();
        return {
          ...message.toJSON(),
          id: message._id,
          createdAt: message.createdAt.toISOString()
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  }
};

module.exports = resolvers;
