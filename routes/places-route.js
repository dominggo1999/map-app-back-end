const express = require('express');

const router = express.Router();

const HttpError = require('../models/HttpError');

// Just dummy data, use database instead
const placeData = require('../data/placesData');

router.get('/:pid', (req, res, next) => {
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

router.get('/user/:uid', (req, res, next) => {
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
});

module.exports = router;
