const express = require("express");
const {
  createJournal,
  updateJournal,
  deleteJournal,
  getJournal,
} = require("../controllers/journalController");
const { uploadfile } = require("../middlewares/fileUpload");
const { verify } = require("../middlewares/auth");
const { isTeacher } = require("../middlewares/role");
const router = express.Router();

router.get("/", verify, getJournal);
router.post(
  "/create",
  verify,
  isTeacher,
  uploadfile.array("upload_file"),
  createJournal
);
router.patch("/update/:journal_id", verify, isTeacher, updateJournal);
router.delete("/remove/:journal_id", verify, isTeacher, deleteJournal);

module.exports = router;
