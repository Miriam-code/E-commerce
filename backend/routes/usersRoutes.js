const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/usersCtrl')

router.post('/register', userCtrl.register);
router.post('/auth', userCtrl.auth);
router.put('/:id', userCtrl.updateUser);
router.delete('/:id', userCtrl.deleteUser)
router.get('/get-all', userCtrl.getAllUsers)
router.get('/me', userCtrl.getUserProfile)

module.exports = router;