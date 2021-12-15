const express = require('express');
const router = express.Router();
const userDetailController = require('../controllers/user/user-detail');

router.get('/detail', userDetailController.handler);

module.exports = router;