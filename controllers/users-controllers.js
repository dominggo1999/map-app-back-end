const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/HttpError');
const errorFormatter = require('../utils/errorFormatter');
const User = require('../models/user');
const convertDocToObj = require('../utils/convertDocToObj');

// Just dummy data, use database instead
const dummyUsers = require('../data/usersData');

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({});
  } catch (err) {
    const error = new HttpError('There is something wrong when getting all users', 500);
    return next(error);
  }

  res.json({ users: convertDocToObj(users) });
};

const getUserById = async (req, res, next) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById({ id: userId });
  } catch (err) {
    const error = new HttpError('There is something wrong when getting user', 500);
    return next(error);
  }

  if(!user) {
    const error = new HttpError('No user found', 404);
    return next(error);
  }

  res.json({
    user: user.toObject({ getters: true }),
  });
};

const signUp = async (req, res, next) => {
  // Validation
  const validationError = validationResult(req).formatWith(errorFormatter);

  if(!validationError.isEmpty()) {
    const errorMessage = new HttpError(validationError.array(), 422);

    return next(errorMessage);
  }

  const {
    username, email, password, places,
  } = req.body;

  // Check if user is exist or not
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Error when checking if user is exist or not', 500);
    return(next(error));
  }

  if(existingUser) {
    const error = new HttpError('Email is already in use', 500);
    return(next(error));
  }

  // Instantiate user
  const createdUser = new User({
    username,
    email,
    password, // this is not the corect way to store password in the database
    image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.iconscout.com%2Ficon%2Ffree%2Fpng-256%2Favatar-370-456322.png&f=1&nofb=1',
    places,
  });

  try {
    createdUser.save();
  } catch (err) {
    const error = new HttpError('Error creating user', 500);
    return(next(error));
  }

  res.json({ createdUser: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  // Validation
  const validationError = validationResult(req).formatWith(errorFormatter);

  if(!validationError.isEmpty()) {
    const errorMessage = new HttpError(validationError.array(), 422);

    return next(errorMessage);
  }

  const { email, password } = req.body;

  // Check user with email
  // Check if user is exist or not
  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Error logging in', 500);
    return(next(error));
  }

  if(!user) {
    const error = new HttpError('There is no user with provided email');
    return next(error);
  }if(password !== user.password) {
    const error = new HttpError('Wrong password');
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
