const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/HttpError');
const errorFormatter = require('../utils/errorFormatter');

// Just dummy data, use database instead
const dummyUsers = require('../data/usersData');

const getAllUsers = (req, res, next) => {
  const users = dummyUsers;

  res.json({
    users,
  });
};

const getUserById = (req, res, next) => {
  const userId = req.params.uid;

  const user = dummyUsers.find((u) => u.id === userId);

  if(!user) {
    const error = new HttpError('No user found', 404);
    return next(error);
  }

  res.json({
    user,
  });
};

const signUp = (req, res, next) => {
  // Validation
  const validationError = validationResult(req).formatWith(errorFormatter);

  if(!validationError.isEmpty()) {
    const errorMessage = new HttpError(validationError.array(), 422);

    return next(errorMessage);
  }

  const { username, email, password } = req.body;
  const newUser = {
    id: uuidv4(),
    username,
    email,
    password,
  };

  // Check if user is already exist
  const isExist = dummyUsers.find((u) => u.email === email);

  if(isExist) {
    const error = new HttpError('Cannot create an account, email is already used', 401);

    return next(error);
  }

  dummyUsers.push(newUser);

  res.status(201).json({
    newUser,
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  // Check if email is exist
  const user = dummyUsers.find((u) => u.email === email);

  if(!user || user.password !== password) {
    const error = new HttpError('Invalid login credentials', 404);
    return next(error);
  }

  res.status(201).json({
    message: 'Login success',
  });
};

exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.signUp = signUp;
exports.login = login;
