const jwt = require("jsonwebtoken");

const contextMiddleware = ctx => {
  if (ctx.req && ctx.req.headers.authorization) {
    const token = ctx.req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      ctx.user = decodedToken;
    });
  }

  return ctx;
};

module.exports = contextMiddleware;
