const jwt = require("jsonwebtoken");
const User = require("../models/users");
const _ = require("lodash");

const isTeacher = async (req, res, next) => {
  if (req.headers["x-access-token"]) {
    const token = req.headers["x-access-token"];

    jwt.verify(token, process.env.JWTKEY, async (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
      const [chk] = await User.findUser({ email: user.email });
      if (_.isEmpty(chk)) {
        return res.status(403).json("User not found!");
      }
      if (chk[0].role !== "teacher") {
        return res.status(403).json("Access not allowed!");
      }
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};
module.exports = { isTeacher };
