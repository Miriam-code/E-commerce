const multer = require('multer');

const imageStorage = multer.diskStorage({

    destination: (req, file, cb) => {
        return cb(null, 'public/upload/products')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + file.originalname)
    }
})

module.exports.imageUpload = multer({
    
    storage: imageStorage,
    limits: {
        fileSize: 1048576,
    },
    fileFilter (req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error('Il fault choisir un fichier jgp, png ou jpeg.'))
        }
        cb(undefined, true)
    }
})