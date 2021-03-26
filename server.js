const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const contextMiddleware = require("./util/contextMiddleware");

require("dotenv").config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
  mongoose
    .connect(process.env.MONGODBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    .then(() => console.log("Connected to MongoDB Database"))
    .catch(err => console.log(err));
});
