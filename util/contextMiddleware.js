const jwt = require("jsonwebtoken");
const { PubSub } = require("apollo-server");

const pubsub = new PubSub();

const contextMiddleware = ctx => {
  let token;
  if (ctx.req && ctx.req.headers.authorization) {
    token = ctx.req.headers.authorization.split("Bearer ")[1];
  } else if (ctx.connection && ctx.connection.context.Authorization) {
    token = ctx.connection.context.Authorization.split("Bearer ")[1];
  }

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      ctx.user = decodedToken;
    });
  }

  ctx.pubsub = pubsub;

  return ctx;
};

module.exports = contextMiddleware;
