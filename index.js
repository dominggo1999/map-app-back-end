const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// No third party import
const placeRouter = require('./routes/places-route');

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // based on body parser

// Router middleware
app.use('/api/places', placeRouter); // => /api/places

// Default error handler
app.use((error, req, res, next) => {
  if(res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({
    message: error.message || 'An unknown error occured',
  });
});

console.log('Starting server');
app.listen(PORT, (err) => {
  if(err) console.error(err);
  console.log(`Success! Your application is running on port ${PORT}`);
});
