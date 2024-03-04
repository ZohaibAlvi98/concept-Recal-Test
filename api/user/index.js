'use strict';

const express = require('express');
const controller = require('./user.controller');
const auth = require('../../auth/auth.service');

const router = express.Router();

router.post('/register', controller.create);

router.get('/fetch', auth.isAuthenticated(), controller.fetch);

router.post('/login', controller.login);

router.get('/users',auth.isAdmin(), controller.users);



module.exports = router;
