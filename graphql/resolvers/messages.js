const {
  UserInputError,
  AuthenticationError,
  ForbiddenError,
  withFilter
} = require("apollo-server");

const User = require("../../models/user");
const Message = require("../../models/message");
const Reaction = require("../../models/reaction");

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
        const { user, pubsub } = ctx;
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

        pubsub.publish("NEW_MESSAGE", { newMessage: fullMessage });

        return fullMessage;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    reactToMessage: async (parent, args, ctx, info) => {
      try {
        const { id, content } = args;
        const { user: decodedUser, pubsub } = ctx;
        if (!decodedUser) throw new AuthenticationError("Unauthenticated");

        const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];
        if (!reactions.includes(content))
          throw new UserInputError("Invalid reaction");

        const user = await User.findById(decodedUser.id);

        const message = await Message.findById(id);
        if (!message) throw new UserInputError("Message not found");

        if (
          message.from.toString() !== user._id.toString() &&
          message.to.toString() !== user._id.toString()
        )
          throw new ForbiddenError("Unauthorized");

        let reaction = await Reaction.findOne({
          $and: [{ messageId: message._id }, { userId: user._id }]
        });

        if (reaction) {
          reaction.content = content;
          await reaction.save();
        } else {
          reaction = new Reaction({
            messageId: message._id,
            userId: user._id,
            content
          });
          await reaction.save();
        }

        pubsub.publish("NEW_REACTION", { newReaction: reaction });

        return reaction;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (parent, args, ctx, info) => {
          const { pubsub, user } = ctx;
          if (!user) throw new AuthenticationError("Unauthenticated");

          return pubsub.asyncIterator(["NEW_MESSAGE"]);
        },
        (parent, args, ctx, info) => {
          const { newMessage } = parent;
          const { user } = ctx;

          if (
            newMessage.from.id.toString() === user.id.toString() ||
            newMessage.to.id.toString() == user.id.toString()
          ) {
            return true;
          }

          return false;
        }
      )
    },
    newReaction: {
      subscribe: withFilter(
        (parent, args, ctx, info) => {
          const { pubsub, user } = ctx;
          if (!user) throw new AuthenticationError("Unauthenticated");

          return pubsub.asyncIterator(["NEW_REACTION"]);
        },
        async (parent, args, ctx, info) => {
          const { newReaction } = parent;
          const { user } = ctx;
          const message = await Message.findById(newReaction.messageId);
          if (
            message.from.toString() === user.id.toString() ||
            message.to.toString() == user.id.toString()
          ) {
            return true;
          }

          return false;
        }
      )
    }
  }
};

module.exports = resolvers;
