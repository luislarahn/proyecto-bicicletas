const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/register', userController.registerForm);
router.post('/register', userController.register);
router.get('/verify/:token', userController.verifyAccount);

module.exports = router;