const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/HttpError');
const errorFormatter = require('../utils/errorFormatter');
const convertDocToObject = require('../utils/convertDocToObj');
const Place = require('../models/place');
const User = require('../models/user');

// Just dummy data, use database instead
const dummyPlaces = require('../data/placesData');

const getAllPlaces = async (req, res, next) => {
  let places;
  try{
    places = await Place.find({});
  }catch(err) {
    const errorMessage = new HttpError('Failed to get places', 500);

    return next(errorMessage);
  }
  res.json({
    places: convertDocToObject(places),
  });
};

// Cari satu place saja
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  // Get data from database
  let place;
  try{
    place = await Place.findById(placeId);
  }catch(err) {
    const errorMessage = new HttpError('Something is wrong when getting places', 500);
    return next(errorMessage);
  }

  // Error handler
  if(!place) {
    const error = new HttpError('There is no place found with the provided place id', 404);
    return next(error);
  }

  res.json({
    place: place.toObject({ getters: true }),
  });
};

// Cari place , bisa lebih dari satu
const getPlacesByUserId = async (req, res, next) => {
  const uid = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: uid });
  } catch (err) {
    const errorMessage = new HttpError('Failed to get places by user');
    return next(errorMessage);
  }

  res.json({
    places: convertDocToObject(places),
  });
};

const createPlace = async (req, res, next) => {
  console.log(req.body);

  // Validation
  const error = validationResult(req).formatWith(errorFormatter);
  if(!error.isEmpty()) {
    const errorMessage = new HttpError(error.array(), 422);
    return next(errorMessage);
  }

  const {
    title, description, imageUrl, address, location, creator,
  } = req.body;

  // Check if creator exist
  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const errorMessage = new HttpError('There is no user found', 404);
    return next(errorMessage);
  }

  const createdPlace = new Place({
    title,
    description,
    imageUrl: req.file.path,
    address,
    location,
    creator,
  });

  /*
    2 proses
    simpan new place ke database
    add place id ke user place property
  */

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await createdPlace.save({ session: sess });
    user.places.push(createdPlace); // Only add the object id
    await user.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Failed to create place', 500);
    return next(error);
  }

  res.status(201).json({
    createdPlace,
  });
};

const updatePlace = async (req, res, next) => {
  // Validation
  const error = validationResult(req).formatWith(errorFormatter);
  if(!error.isEmpty()) {
    const errorMessage = new HttpError(error.array(), 422);
    return next(errorMessage);
  }

  const placeId = req.params.pid;

  const {
    title, description,
  } = req.body;

  // Get place that need to update from DB
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const errorMessage = new HttpError('Something is wrong when finding the place', 500);
    return next(errorMessage);
  }

  if(!place) {
    const err = new HttpError('Cannot find this place', 404);
    return next(err);
  }

  // Edit property need to update
  place.title = title;
  place.description = description;

  // Update database
  try {
    await place.save();
  } catch (error) {
    const errorMessage = new HttpError('Something is wrong when updating the place', 500);
    return next(errorMessage);
  }

  return res.json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  // Get place that need to delete from DB
  let place;
  try {
    place = await Place.findById(placeId).populate('creator'); // hapus id di creator(user) juga
  } catch (error) {
    const errorMessage = new HttpError('Something is wrong when finding the place', 500);
    return next(errorMessage);
  }

  if(!place) {
    const err = new HttpError('Cannot find this place', 404);
    return next(err);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await place.remove({ session: sess });
    place.creator.places.pull(place); // Remove place id from user places
    await place.creator.save({ session: sess });

    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    const errorMessage = new HttpError('Something is wrong when deleting the place', 500);
    return next(errorMessage);
  }

  res.status(200).json({
    message: 'Deleting file is done',
  });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.getAllPlaces = getAllPlaces;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
