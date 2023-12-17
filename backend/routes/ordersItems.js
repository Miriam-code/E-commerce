const express = require('express');
const router = express.Router();
const ordersItemsCtrl = require('../controllers/ordersItemsCtrl')

router.put('/:id', ordersItemsCtrl.updateOrderProductsQuantity);
router.delete('/:id', ordersItemsCtrl.deleteProductFromOrder);

module.exports = router;