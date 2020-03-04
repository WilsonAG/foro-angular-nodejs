'use strict';

const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

router.post('/register', UserController.save);
router.post('/login', UserController.login);

module.exports = router;
