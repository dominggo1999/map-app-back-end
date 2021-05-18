const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users-controllers');

router.get('/', usersController.getAllUsers);

router.get('/:uid', usersController.getUserById);

router.post('/signUp', usersController.signUp);

router.post('/login', usersController.login);

module.exports = router;
