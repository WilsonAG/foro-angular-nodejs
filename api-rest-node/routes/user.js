'use strict';

const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();
const authMiddleware = require('../middlewares/Auth');
const multiPart = require('connect-multiparty');

const uploadMiddleware = multiPart({ uploadDir: './uploads/users' });

router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.put('/update', authMiddleware.auth, UserController.update);
router.post(
	'/upload-avatar',
	[authMiddleware.auth, uploadMiddleware],
	UserController.uploadAvatar
);
router.get('/avatar/:fileName', UserController.avatar);
router.get('/users', UserController.getUsers);
router.get('/user/:id', UserController.getUser);

module.exports = router;
