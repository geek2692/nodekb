const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

// Init App
const app = express();

