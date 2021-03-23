const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");

require("dotenv").config();

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin"
  },
  {
    title: "City of Glass",
    author: "Paul Auster"
  }
];

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }
  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: () => books
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
  mongoose
    .connect(process.env.MONGODBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log("Connected to MongoDB Database"))
    .catch(err => console.log(err));
});
