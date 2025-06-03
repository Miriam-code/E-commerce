const multer = require('multer');

const destinationFn = (req, file, cb) => {
  cb(null, 'public/upload/products');
};

const filenameFn = (req, file, cb) => {
  cb(null, file.fieldname + '_' + Date.now() + file.originalname);
};

const imageStorage = multer.diskStorage({
  destination: destinationFn,
  filename: filenameFn
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1048576,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error('Il fault choisir un fichier jgp, png ou jpeg.'));
    }
    cb(undefined, true);
  }
});

module.exports = {
  imageUpload,
  destinationFn,
  filenameFn
};
