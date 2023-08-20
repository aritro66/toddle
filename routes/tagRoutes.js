const express = require("express");
const {
  getAllTaggedStudents,
  createTag,
  deleteTag,
} = require("../controllers/taggedStudentController");
const { verify } = require("../middlewares/auth");
const { isTeacher } = require("../middlewares/role");
const router = express.Router();

router.get("/:journal_id", verify, getAllTaggedStudents);
router.post("/create", verify, isTeacher, createTag);
router.delete("/remove/:tag_id", verify, isTeacher, deleteTag);

module.exports = router;
