const express = require('express');
const router = express.Router();
const ordersCtrl = require('../controllers/ordersCtrl')

router.post('/create', ordersCtrl.create);
router.put('/:id', ordersCtrl.updateStatus);
router.delete('/:id', ordersCtrl.delete);
router.get('/get-all', ordersCtrl.getAll);
router.get('/get-one/:id', ordersCtrl.getOne);
router.get('/getmyorders/:id', ordersCtrl.getOrdersUser);

module.exports = router;