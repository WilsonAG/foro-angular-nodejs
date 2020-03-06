'use strict';

const express = require('express');
const TopicController = require('../controllers/TopicController');

const router = express.Router();
const authMiddleware = require('../middlewares/Auth');

router.post('/topic', authMiddleware.auth, TopicController.save);

module.exports = router;
