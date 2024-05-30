const jwt = require("jsonwebtoken");

const middleAuth = {
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
      const accessToken = token.split(" ")[1];

      jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN, (err, user) => {
        if (err) {
          return res.status(403).json("Token not exist!");
        }

        req.user = user;

        next();
      });
    } else return res.status(401).json("You do not have access !");
  },
};

module.exports = middleAuth;
