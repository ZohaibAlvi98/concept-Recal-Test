'use strict';

const express = require('express');
const controller = require('./project.controller');
const auth = require('../../auth/auth.service');
const { create,update } = require('./project.validator');

const router = express.Router();

router.post('/create',create,auth.isAuthenticated(), controller.create);

router.get('/fetch/all/:type',auth.isAuthenticated(), controller.fetchAll);

router.post('/change/status',auth.isAuthenticated(), controller.changeStatus);

router.post('/update',update,auth.isAuthenticated(), controller.update);

router.get('/search',auth.isAuthenticated(), controller.searchCriteria);

module.exports = router;
