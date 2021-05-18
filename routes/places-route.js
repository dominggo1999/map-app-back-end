const express = require('express');

const router = express.Router();
const { check } = require('express-validator');

const placeControllers = require('../controllers/places-controllers');

router.get('/', placeControllers.getAllPlaces);

router.get('/:pid', placeControllers.getPlaceById);

router.get('/user/:uid', placeControllers.getPlacesByUserId);

router.post('/',
  check('title')
    .not()
    .isEmpty(),
  check('description')
    .isLength({ min: 5 }),
  check('imageUrl')
    .not()
    .isEmpty(),
  check('address')
    .not()
    .isEmpty(),
  check('location.lat')
    .isFloat({ min: -90, max: 90 }),
  check('location.lng')
    .isFloat({ min: -180, max: 180 }),
  placeControllers.createPlace);

router.patch('/:pid',
  check('title')
    .not()
    .isEmpty(),
  check('description')
    .isLength({ min: 5 }),
  placeControllers.updatePlace);

router.delete('/:pid', placeControllers.deletePlace);

module.exports = router;
