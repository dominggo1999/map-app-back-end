require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const HttpError = require('./models/HttpError');

// No third party import
const placeRouter = require('./routes/places-route');
const userRouter = require('./routes/users-route');

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // based on body parser

// Serve static files
// Harus ada "/" di awal
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

// Router middleware
app.use('/api/places/', placeRouter); // => /api/places
app.use('/api/users/', userRouter);

// When there is no route match the url
app.use((req, res, next) => {
  const error = new HttpError('Could not found this route');

  return next(error);
});

// Default error handler
app.use((error, req, res, next) => {
  // Kalau sudah file udah dibuat tapi error
  // Unlink file path
  if(req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if(res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({
    message: error.message || 'An unknown error occured',
  });
});

console.log('Starting server');
// Connecting to mongodb atlas
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
    // Start server only if database connection is success
    app.listen(PORT, (err) => {
      if(err) console.error(err);
      console.log(`Success! Your application is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
