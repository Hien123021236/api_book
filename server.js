/* eslint-disable no-undef */
// third party components
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const morgan = require('morgan');
const cors = require('cors');
// const moment = require('moment-timezone');

// our components
const config = require('./app/configs/general.config');
const multer = require('./app/uploader/multer');

const app = express();

// init global variables
global.INFO = {};
global.INFO.anonymousId = 0;
global.INFO.rootPath = __dirname;
global.INFO.setting = {};

// log by using morgan
app.use(morgan('combined'));
app.use(morgan('dev', {
  skip: function(req, res) {
    return res.statusCode < 400;
  },
}));

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json({
  limit: '5mb',
  type: 'multipart/form-data; application/vnd.api+json',
  extended: true,
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  limit: '5mb',
  extended: true,
}));

app.use(bodyParser.json({
  extended: true,
}));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));


const corsOption = {
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false,
  'optionsSuccessStatus': 200,
};

app.use(cors(corsOption));

// Public Location
app.use('/public', express.static(global.INFO.rootPath + config.paths.public));

app.use(multer.any());

// Auth Middleware - This will check if the token is valid
app.all('/v1/auth/*', [require('./app/middlewares/auth.middelwares')]);

// Routes for API
require('./app/routes/index')(app); // configure our routes

// Create App
const httpServer = require('http').createServer(app);

// Models
require('./app/models/index'); // initialize models

// // Jobs
// require('./app/jobs/index') // initialize jobs


process.on('SIGINT', function() {
  // Stops the server from accepting new connections and finishes existing connections.
  httpServer.close(function(error) {
    if (error) {
      process.exit(1);
    }
  });
});

process.on('message', (msg) => {
  if (msg === 'shutdown') {
    setTimeout(() => {
      process.exit(0);
    }, 1500);
  }
});

// Start App: http://IP_Address:port
const httpPort = parseInt(config.port) + (process.env.NODE_APP_INSTANCE ? parseInt(process.env.NODE_APP_INSTANCE) : 0);
httpServer.listen( httpPort, function() {
  process.send('ready');
});

console.log('PORT: ', config.port);
