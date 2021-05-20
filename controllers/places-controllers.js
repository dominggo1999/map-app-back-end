const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/HttpError');
const errorFormatter = require('../utils/errorFormatter');
const Place = require('../models/place');

// Just dummy data, use database instead
let dummyPlaces = require('../data/placesData');

const getAllPlaces = ((req, res, next) => {
  const places = dummyPlaces;

  res.json({
    places,
  });
});

// Cari satu place saja
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  // Get data from database

  let place;
  try{
    place = await Place.findById(placeId);
  }catch(err) {
    const errorMessage = new HttpError('Something is wrong', 500);
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
const getPlacesByUserId = (req, res, next) => {
  const uid = req.params.uid;
  const place = dummyPlaces.filter((p) => {
    return p.creator === uid;
  });

  if(place.length === 0) {
    const error = new HttpError('There is no place found with the provided user id', 404);

    return next(error);
  }

  res.json({
    place,
  });
};

const createPlace = async (req, res, next) => {
  // Validation
  const error = validationResult(req).formatWith(errorFormatter);
  if(!error.isEmpty()) {
    const errorMessage = new HttpError(error.array(), 422);
    return next(errorMessage);
  }

  const {
    title, description, imageUrl, address, location, creator,
  } = req.body;

  const createdPlace = new Place({
    id: uuidv4(),
    title,
    description,
    imageUrl,
    address,
    location,
    creator,
  });

  try {
    await createdPlace.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError('Failed to create place', 500);
    return next(error);
  }

  res.status(201).json({
    createdPlace,
  });
};

const updatePlace = (req, res, next) => {
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

  // Salin dummy data yang mau diubah
  const updatedPlace = { ...dummyPlaces.find((p) => p.id === placeId) };
  const placeIndex = dummyPlaces.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  // Change updated place
  dummyPlaces[placeIndex] = updatedPlace;

  res.status(200).json({
    updatedPlace,
  });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  const deletedPlace = dummyPlaces.find((p) => p.id === placeId);
  dummyPlaces = dummyPlaces.filter((p) => p.id !== placeId);

  if(!deletedPlace) {
    const error = new HttpError('There is no place with the provided id', 404);
    return next(error);
  }

  res.status(200).json({
    dummyPlaces,
  });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.getAllPlaces = getAllPlaces;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
