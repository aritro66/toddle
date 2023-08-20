const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storageimg = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    console.log(file);
    const fileExtension = file.originalname.split(".")[1];
    const uniqueName = uuidv4() + "." + fileExtension;
    cb(null, uniqueName);
  },
});

const uploadfile = multer({ storage: storageimg });

module.exports = { uploadfile };
