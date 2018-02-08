const HEADER_REGEX = /bearer (.*)$/;

/**
 * This is an extremely simple token. In real applications make
 * sure to use a better one, such as JWT (https://jwt.io/).
 */
module.exports.authenticate = async ({ headers: { authorization } }, Users) => {
  const jwt = require("jsonwebtoken");
  console.log(authorization)
  if (authorization !== null) {
    const token = HEADER_REGEX.exec(authorization)[1];
    const user = jwt.verify(token, "7@zSgNXsY5rp)zL5");
    return user;
  } else {
      return {};
  }
};
