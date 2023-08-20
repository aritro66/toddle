const express = require("express");
const { getStudentList } = require("../controllers/userController");
const { verify } = require("../middlewares/auth");
const { isTeacher } = require("../middlewares/role");
const router = express.Router();

router.get("/students", verify, isTeacher, getStudentList);

module.exports = router;
