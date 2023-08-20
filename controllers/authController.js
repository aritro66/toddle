const User = require("../models/users");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { catchAsyncError } = require("../middlewares/catchAsyncError");

const registerUser = catchAsyncError(async (req, res) => {
  const { name, email, phno, password, role } = req.body;

  if (
    !(email && password && phno && name && role) ||
    (role !== "student" && role !== "teacher")
  ) {
    res.status(400).send("All valid input is required");
  }
  const [oldUser] = await User.findUser(req.body);

  if (oldUser.length > 0 && oldUser[0].email === email) {
    return res.status(409).send("User Already Exist. Please Login");
  }
  encryptedPassword = await bcrypt.hash(password, 10);
  const newId = uuidv4();
  await User.addUser({
    id: newId,
    name,
    email: email.toLowerCase(),
    phno,
    password: encryptedPassword,
    role,
  });
  const user = {
    id: newId,
    name,
    email: email.toLowerCase(),
    phno,
    role,
  };

  const token = jwt.sign({ user_id: newId, email }, process.env.JWTKEY, {
    expiresIn: "2h",
  });
  user.token = token;

  res.status(201).json(user);
});

const loginUser = catchAsyncError(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!(email && password)) {
    res.status(400).send("All valid input is required");
  }
  const [user] = await User.findUser(req.body);

  if (user.length > 0 && (await bcrypt.compare(password, user[0].password))) {
    const token = jwt.sign({ user_id: user[0].id, email }, process.env.JWTKEY, {
      expiresIn: "2h",
    });
    user[0].token = token;
    delete user[0].password;
    res.status(200).json(user[0]);
  } else {
    res.status(400).send("Invalid Credentials");
  }
});

const logoutUser = catchAsyncError(async (req, res) => {
  const authHeader = req.headers["x-access-token"];
  jwt.sign(authHeader, "", { expiresIn: 1 }, (logout, err) => {
    if (logout) {
      res.send({ msg: "You have been Logged Out" });
    } else {
      res.send({ msg: "Error" });
    }
  });
});

module.exports = { registerUser, loginUser, logoutUser };
