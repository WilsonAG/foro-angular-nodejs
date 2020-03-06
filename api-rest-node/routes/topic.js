'use strict';

const express = require('express');
const TopicController = require('../controllers/TopicController');

const router = express.Router();
const authMiddleware = require('../middlewares/Auth');

router.post('/topic', authMiddleware.auth, TopicController.save);
router.get('/topics/:page?', TopicController.getTopics);
router.get('/topics/:page?', TopicController.getTopics);
router.get('/user-topics/:userID', TopicController.getTopicsByUser);
router.get('/topic/:id', TopicController.getTopic);
module.exports = router;
