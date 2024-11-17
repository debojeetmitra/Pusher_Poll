const mongoose = require('mongoose');

// Load environment variables from .env file
require('dotenv').config();

// Map global promises
mongoose.Promise = global.Promise;

// Mongoose Connect using the MongoDB URI from the .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
