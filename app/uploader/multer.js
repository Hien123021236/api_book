const multer = require('multer');
const path = require('path');
// const util = require('util');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve('tmp'));
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({storage: storage});

// const uploadManyFiles = multer({storage: storage}).array('many_files', 5);

// const multipleUpload = util.promisify(uploadManyFiles);

module.exports = upload;
