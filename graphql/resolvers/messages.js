const User = require("../../models/user");
const Message = require("../../models/message");
const { UserInputError, AuthenticationError } = require("apollo-server");

const resolvers = {
  Query: {
    getMessages: async (parent, args, ctx, info) => {
      try {
        const { user } = ctx;
        if (!user) throw new AuthenticationError("Unauthenticated");

        const { id } = args;
        const otherUser = await User.findById(id);
        if (!otherUser) throw new UserInputError("User not found");

        const userIds = [otherUser._id, user.id];
        const messages = await Message.find({
          from: { $in: userIds },
          to: { $in: userIds }
        })
          .populate("from", "_id username")
          .populate("to", "_id username")
          .sort({ createdAt: -1 })
          .exec();

        return messages;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  },
  Mutation: {
    sendMessage: async (parent, args, ctx, info) => {
      try {
        const { user } = ctx;
        if (!user) throw new AuthenticationError("Unauthenticated");

        const { id, content } = args;
        const recipient = await User.findById(id);

        if (!recipient) {
          throw new UserInputError("User not found");
        } else if (recipient._id.toString() === user.id.toString()) {
          throw new UserInputError("You can't message yourself");
        }

        if (content.trim() === "") throw new UserInputError("Message is Empty");

        const message = new Message({ content, from: user.id, to: id });
        await message.save();
        const fullMessage = await Message.findById(message._id)
          .populate("from", "_id username")
          .populate("to", "_id username")
          .exec();
        return fullMessage;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  }
};

module.exports = resolvers;
