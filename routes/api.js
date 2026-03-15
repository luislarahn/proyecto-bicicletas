const express = require('express');
const router = express.Router();
const authControllerAPI = require('../controllers/api/authControllerAPI');

router.post('/authenticate', authControllerAPI.authenticate);
router.post('/forgot-password', authControllerAPI.forgotPassword);

module.exports = router;