const express = require('express');

const router = express.Router();

// Just dummy data, use database instead
const placeData = require('../data/placesData');

router.get('/:pid', (req, res, next) => {
  const placeId = req.params.pid;
  const place = placeData.find((p) => {
    return p.id === placeId;
  });

  // Error handler
  if(!place) {
    res.status(404);
    res.json({
      message: 'There is no place found with the provided id',
    });
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
    res.status(404);
    res.json({
      message: 'There is no place found with the provided user id',
    });
  }

  res.json({
    place,
  });
});

module.exports = router;
