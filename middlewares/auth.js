const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
  if (req.headers["x-access-token"]) {
    const token = req.headers["x-access-token"];

    jwt.verify(token, process.env.JWTKEY, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};
module.exports = { verify };
