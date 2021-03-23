const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    username: String!
    email: String!
  }
  type Query {
    getUsers: [User]!
  }
`;

module.exports = typeDefs;
