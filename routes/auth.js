const { expressjwt: jwt } = require("express-jwt");
const secret = require("../config").secret;

function getTokenFromHeader(req) {
  if (!req.headers.authorization) return null;
  const token = req.headers.authorization.split(" ");
  if (token[0] !== "Ecommerce") return null;
  return token[1];
}

const auth = {
  required: jwt({
    secret,
    algorithms: ["sha2", "RS256", "HS256"],
    requestProperty: "payload",
    getToken: getTokenFromHeader,
  }),
  optional: jwt({
    secret,
    algorithms: ["sha2", "RS256", "HS256"],
    requestProperty: "payload",
    credentialsRequired: false,
    getToken: getTokenFromHeader,
  }),
};

module.exports = auth;
