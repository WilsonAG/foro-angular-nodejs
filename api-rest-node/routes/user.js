'use strict';

const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();
const authMiddleware = require('../middlewares/Auth');

router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.put('/update', authMiddleware.auth, UserController.update);

module.exports = router;
