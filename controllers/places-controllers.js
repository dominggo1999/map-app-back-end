const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/HttpError');

// Just dummy data, use database instead
const placeData = require('../data/placesData');
let dummyPlaces = require('../data/placesData');

const getAllPlaces = ((req, res, next) => {
  const places = dummyPlaces;

  res.json({
    places,
  });
});

const getPlaceById = ((req, res, next) => {
  const placeId = req.params.pid;
  const place = placeData.find((p) => {
    return p.id === placeId;
  });

  // Error handler
  if(!place) {
    const error = new HttpError('There is no place found with the provided place id', 404);
    return next(error);
  }

  res.json({
    place,
  });
});

const getPlaceByUserId = (req, res, next) => {
  const uid = req.params.uid;
  const place = placeData.filter((p) => {
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

const createPlace = (req, res, next) => {
  const {
    title, description, imageUrl, address, location, creator,
  } = req.body;

  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    imageUrl,
    address,
    location,
    creator,
  };

  // Push data to database
  dummyPlaces.push(createdPlace);

  res.status(201).json({
    createdPlace,
  });
};

const updatePlace = (req, res, next) => {
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
  dummyPlaces = dummyPlaces.filter((p) => p.id !== placeId);

  res.status(200).json({
    dummyPlaces,
  });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.getAllPlaces = getAllPlaces;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
