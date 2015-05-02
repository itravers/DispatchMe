var bodyParser = require('body-parser');
var csrf = require('csurf');
var express = require('express');
var mongoose = require('mongoose');
var session = require('client-sessions');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var monk = require('monk');
var db = monk('localhost:27017/DispatchMe');
var passport = require('passport')
//DB Connection.
var mongo = require('mongodb');


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/DispatchMe');


var middleware = require('./middleware');

/**
 * Given a user object:
 *
 *  - Store the user object as a req.user
 *  - Make the user object available to templates as #{user}
 *  - Set a session cookie with the user object
 *
 *  @param {Object} req - The http request object.
 *  @param {Object} res - The http response object.
 *  @param {Object} user - A user object.
 */
module.exports.createUserSession = function(req, res, user) {
  var cleanUser = {
    firstName:  user.firstName,
    lastName:   user.lastName,
    email:      user.email,
    data:       user.data || {},
  };

  req.session.user = cleanUser;
  req.user = cleanUser;
  res.locals.user = cleanUser;
};

/**
 * Create and initialize an Express application that is 'fully loaded' and
 * ready for usage!
 *
 * This will also handle setting up all dependencies (like database
 * connections).
 *
 * @returns {Object} - An Express app object.
 */
module.exports.createApp = function() {
  var app = express();
  

  // settings
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.locals.pretty = true;

  // middleware
  //uncomment after placing your favicon in /public
  //app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(passport.initialize());
  app.use(passport.session()); 
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({
  	cookieName: 'session',
  	secret: 'keyboard cat',
  	duration: 30 * 60 * 1000,
  	activeDuration: 5 * 60 * 1000,
  	httpOnly: true, //don't allow js access to cookie
  	secure: false, //if true only allow cookies over https
  	ephemeral: false //if true delete this cookie when browser is closed.
  }));
  
  app.use(csrf());
  app.use(middleware.simpleAuth);
  app.use(function(req, res, next){
  //Let requests and responses have access to the db
	req.mongoose = mongoose;
  req.db = db;
  next();
});
  return app;
};

/**
 * Ensure a user is logged in before allowing them to continue their request.
 *
 * If a user isn't logged in, they'll be redirected back to the login page.
 */
module.exports.requireLogin = function(req, res, next) {
  if (!req.user) {
    res.redirect('/users/login');
  } else {
    next();
  }
};
