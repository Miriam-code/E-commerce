const express = require('express');
const router = express.Router();
const productsCtrl = require('../controllers/productsCtrl');
const { imageUpload } = require('../middleware/multer');

router.post('/create', imageUpload.single('image'), productsCtrl.create);
router.put('/:id', imageUpload.single('image'), productsCtrl.update);
router.delete('/:id', productsCtrl.delete);
router.get('/get-all', productsCtrl.getAllProducts);
router.get('/get-one/:id', productsCtrl.getOneProduct);

module.exports = router;