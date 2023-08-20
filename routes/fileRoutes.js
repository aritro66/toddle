const express = require("express");
const {
  getFile,
  addFile,
  updateFile,
  deleteFile,
} = require("../controllers/fileController");
const { uploadfile } = require("../middlewares/fileUpload");
const { verify } = require("../middlewares/auth");
const { isTeacher } = require("../middlewares/role");
const router = express.Router();

router.get("/:id", verify, getFile);
router.post(
  "/add",
  verify,
  isTeacher,
  uploadfile.single("upload_file"),
  addFile
);
router.patch(
  "/update/:file_id",
  verify,
  isTeacher,
  uploadfile.single("upload_file"),
  updateFile
);
router.delete("/remove/:file_id", verify, isTeacher, deleteFile);

module.exports = router;
