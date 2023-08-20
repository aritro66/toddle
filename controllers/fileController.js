const File = require("../models/file");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const { catchAsyncError } = require("../middlewares/catchAsyncError");
const fs = require("node:fs/promises");
const path = require("path");

const getFile = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send("All input is required");
  }
  const [chk] = await File.getFileById(id);
  if (_.isEmpty(chk)) {
    res.status(404).send("File not found");
  } else {
    res.setHeader("Content-Type", chk[0].mimetype);
    const filePath = path.join(__dirname, `../${chk[0].file_path}`);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.log(err);
        res.status(404).json("file unavailable");
      } else {
        console.log("file sent");
      }
    });
  }
});

const addFile = catchAsyncError(async (req, res) => {
  const { journal_id } = req.body;
  if (!journal_id || !req.file) {
    res.status(400).send("All input is required");
  }
  const newId = uuidv4();
  await File.addFile({
    id: newId,
    journal_id,
    file_name: req.file.filename,
    file_path: req.file.path,
    mimetype: req.file.mimetype,
  });

  res.status(201).json("File added successfully");
});

const updateFile = catchAsyncError(async (req, res) => {
  const { file_id } = req.params;
  if (!file_id && !req.file) {
    res.status(400).send("All input is required");
  }
  const [chk] = await File.getFileById(file_id);
  if (_.isEmpty(chk)) {
    res.status(404).send("File not found");
  } else {
    await fs.unlink(chk[0].file_path);
    await File.updateFile(file_id, req.file);
    res.status(200).json({ message: "File updated successfully" });
  }
});

const deleteFile = catchAsyncError(async (req, res) => {
  const { file_id } = req.params;
  if (!file_id) {
    res.status(400).send("All input is required");
  }
  const [chk] = await File.getFileById(file_id);
  if (_.isEmpty(chk)) {
    res.status(404).send("File not found");
  } else {
    await fs.unlink(chk[0].file_path).catch((err) => {
      console.log(err);
    });
    await File.deleteFile(file_id);
    res.status(204).json({ message: "File deleted successfully" });
  }
});

module.exports = { getFile, addFile, updateFile, deleteFile };
