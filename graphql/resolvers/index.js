const userResolvers = require("./users");
const messageResolvers = require("./messages");

const User = require("../../models/user");
const Message = require("../../models/message");

const resolvers = {
  Message: {
    createdAt: parent => parent.createdAt.toISOString()
  },
  User: {
    createdAt: parent => parent.createdAt.toISOString()
  },
  Reaction: {
    createdAt: parent => parent.createdAt.toISOString(),
    Message: async parent =>
      await Message.findById(parent.messageId)
        .populate("from", "_id username")
        .populate("to", "_id username")
        .exec(),
    User: async parent =>
      await User.findById(parent.userId)
        .populate("-email -hashedPassword")
        .exec()
  },
  Query: {
    ...userResolvers.Query,
    ...messageResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...messageResolvers.Mutation
  },
  Subscription: {
    ...messageResolvers.Subscription
  }
};

module.exports = resolvers;
