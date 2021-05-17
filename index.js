const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // based on body parser

// Use defined routes
app.use('/posts', require('./routers/postRoutes'));

console.log('Starting server');
app.listen(PORT, (err) => {
  if(err) console.error(err);
  console.log(`Success! Your application is running on port ${PORT}`);
});
