// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// DB Config
require('./config/db');  // This is where you're configuring MongoDB, ensure the connection uses the env variables

const app = express();

// Routes
const poll = require('./routes/poll');

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Enable CORS
app.use(cors());

// Use poll route
app.use('/poll', poll);

const port = process.env.PORT || 3000; // You can set the port dynamically using the .env file

// Start the server
app.listen(port, () => console.log(`Server started on port ${port}`));
