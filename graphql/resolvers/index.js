const userResolvers = require("./users");
const messageResolvers = require("./messages");

const resolvers = {
  Message: {
    createdAt: parent => parent.createdAt.toISOString()
  },
  User: {
    createdAt: parent => parent.createdAt.toISOString()
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
