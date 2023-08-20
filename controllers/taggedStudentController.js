const Tag = require("../models/taggedstudent");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const { catchAsyncError } = require("../middlewares/catchAsyncError");

const getAllTaggedStudents = catchAsyncError(async (req, res) => {
  const { journal_id } = req.params;
  if (!journal_id) {
    res.status(400).send("All input is required");
  }
  const [data] = await Tag.getTaggedStudents(journal_id);
  res.status(200).json(data);
});

const createTag = catchAsyncError(async (req, res) => {
  const { journal_id, student_id } = req.body;
  if (!(journal_id && student_id)) {
    res.status(400).send("All input is required");
  }
  const newId = uuidv4();
  await Tag.addTag({ id: newId, journal_id, student_id });

  res.status(201).json("Tagged successfully");
});

const deleteTag = catchAsyncError(async (req, res) => {
  const { tag_id } = req.params;
  if (!tag_id) {
    res.status(400).send("All input is required");
  }
  await Tag.deleteTag(tag_id);
  res.status(204).json({ message: "Tag deleted successfully" });
});

module.exports = { getAllTaggedStudents, createTag, deleteTag };
