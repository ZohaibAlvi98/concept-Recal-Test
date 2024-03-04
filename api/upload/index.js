'use strict';

const express = require('express');
const auth = require('../../auth/auth.service');
const controller = require('./upload.controller');

const router = express.Router();

router.post('/image',auth.isAuthenticated(),controller.uploadImage);

module.exports = router;
