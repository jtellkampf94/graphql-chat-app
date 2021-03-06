const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String
    createdAt: String!
    token: String
    profilePictureUrl: String
    latestMessage: Message
  }
  type Message {
    id: ID!
    content: String!
    from: Username!
    to: Username!
    createdAt: String!
    reactions: [Reaction]
  }
  type Reaction {
    id: ID!
    content: String!
    message: Message!
    user: User!
    createdAt: String!
  }
  type Username {
    id: ID!
    username: String!
  }
  type Query {
    getUsers: [User]!
    login(username: String!, password: String!): User!
    getMessages(id: ID!): [Message]!
  }
  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    sendMessage(id: ID!, content: String!): Message!
    reactToMessage(id: ID!, content: String!): Reaction!
  }
  type Subscription {
    newMessage: Message!
    newReaction: Reaction!
  }
`;

module.exports = typeDefs;
