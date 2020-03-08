'use strict';

const express = require('express');
const CommentController = require('../controllers/CommentController');

const router = express.Router();
const authMiddleware = require('../middlewares/Auth');

router.post('/comment/topic/:id', authMiddleware.auth, CommentController.add);
router.put('/comment/:id', authMiddleware.auth, CommentController.update);
router.delete(
	'/comment/:topicID/:commentID',
	authMiddleware.auth,
	CommentController.delete
);

module.exports = router;
