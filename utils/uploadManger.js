const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

module.exports = (path) => {
  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path);
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4() + file.originalname);
    }
  });

  return multer({ storage: fileStorage });
};
