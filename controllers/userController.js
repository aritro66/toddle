const User = require("../models/users");
const { catchAsyncError } = require("../middlewares/catchAsyncError");

const getStudentList = catchAsyncError(async (req, res) => {
  const [data] = await User.getAllStudents();
  res.status(200).json(data);
});

module.exports = { getStudentList };
