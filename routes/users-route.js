const express = require('express');

const router = express.Router();
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');

const fileUpload = require('../middlewares/file-upload');

router.get('/', usersController.getAllUsers);

router.get('/:uid', usersController.getUserById);

router.post('/signUp',
  fileUpload.single('imageUrl'),
  check('username')
    .not()
    .isEmpty()
    .not()
    .isEmail(),
  check('email')
    .normalizeEmail()
    .isEmail(),
  check('password')
    .isLength({ min: 8 }),
  usersController.signUp);

router.post('/login',
  check('email')
    .normalizeEmail()
    .isEmail(),
  check('password')
    .isLength({ min: 8 }),
  usersController.login);

module.exports = router;
