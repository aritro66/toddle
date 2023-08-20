const Journal = require("../models/journal");
const User = require("../models/users");
const Tag = require("../models/taggedstudent");
const File = require("../models/file");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { catchAsyncError } = require("../middlewares/catchAsyncError");
const { sendmail } = require("../services/mailService");

const tagPromise = (journal_id, student_id) => {
  return Tag.addTag({ id: uuidv4(), journal_id, student_id });
};

const filePromise = (journal_id, file) => {
  return File.addFile({
    id: uuidv4(),
    journal_id,
    file_name: file.filename,
    file_path: file.path,
    mimetype: file.mimetype,
  });
};

const getJournal = catchAsyncError(async (req, res) => {
  const token = req.headers["x-access-token"];
  jwt.verify(token, process.env.JWTKEY, async (err, user) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const [chk] = await User.findUser({ email: user.email });
    if (_.isEmpty(chk)) {
      return res.status(404).json("User not found!");
    }
    const journalsMap = new Map();
    const protocol = req.protocol;
    const host = req.hostname;
    const port = process.env.PORT || 4001;

    const baseUrl = `${protocol}://${host}:${port}`;
    if (chk[0].role !== "student" && chk[0].role !== "teacher") {
      return res.status(403).json("Invalid role!");
    }
    [data] =
      chk[0].role === "teacher"
        ? await Journal.getJournalForTeacher(chk[0].id)
        : await Journal.getJournalForStudent(chk[0].id);
    for (const row of data) {
      if (!journalsMap.has(row.journal_id)) {
        journalsMap.set(row.journal_id, {
          journal_id: row.journal_id,
          teacher_id: row.teacher_id,
          teacher_name: row.name,
          description: row.description,
          published_at: row.published_at,
          files: [],
        });
      }
      if (row.file_id) {
        journalsMap.get(row.journal_id).files.push({
          file_id: row.file_id,
          url: `${baseUrl}/api/v1/files/${row.file_id}`,
        });
      }
    }
    const journalsWithFiles = Array.from(journalsMap.values());
    res.status(200).json(journalsWithFiles);
  });
});

const createJournal = catchAsyncError(async (req, res) => {
  const { teacher_id, description, published_at } = req.body;
  let { tags } = req.body;
  console.log(req.body, "req.body");
  if (!(teacher_id && description && published_at)) {
    res.status(400).send("All input is required");
  }

  const newJournalId = uuidv4();
  await Journal.addJournal({
    id: newJournalId,
    teacher_id,
    description,
    published_at,
  });
  const journal = {
    id: newJournalId,
    teacher_id,
    description,
    published_at,
  };
  const promises = [];
  const [teacherDetail] = await User.findUserById(teacher_id);
  if (req.files) {
    req.files.forEach((file) => {
      promises.push(filePromise(newJournalId, file));
    });
  }
  console.log(tags, "tags");
  if (typeof tags === "string" && tags.length > 0) {
    tags = tags.split(",");
  }
  if (_.isArray(tags)) {
    const [studentInfo] = await User.findUserByTag(tags);
    tags.forEach((student_id) => {
      console.log(student_id, "student_id");
      promises.push(tagPromise(newJournalId, student_id));
    });
    console.log(studentInfo, "studentInfo");
    studentInfo.forEach((student) => {
      console.log(student, "student");
      promises.push(
        sendmail(student.email, teacherDetail[0].name, student.name)
      );
    });
  }

  await Promise.all(promises);

  res.status(201).json(journal);
});

const updateJournal = catchAsyncError(async (req, res) => {
  const { journal_id } = req.params;
  if (!journal_id) {
    res.status(400).send("All input is required");
  }
  await Journal.updateJournal(journal_id, req.body);
  res.status(200).json({ message: "Journal updated successfully" });
});

const deleteJournal = catchAsyncError(async (req, res) => {
  const { journal_id } = req.params;
  if (!journal_id) {
    res.status(400).send("All input is required");
  }
  await Journal.deleteJournal(journal_id);
  res.status(204).json({ message: "Journal deleted successfully" });
});

module.exports = { createJournal, updateJournal, deleteJournal, getJournal };
