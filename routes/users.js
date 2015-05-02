/**
 * Name: users.js
 * Author: Isaac Assegai
 * Date: 5/1/2015
 * Purpose: Establishes an API for Interacting with user information
 * 	        this includes registering, logging in, etc.
 */

/** App Variables ******************************************************/
var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var sessions = require('client-sessions');
var bcrypt = require('bcryptjs');
var models = require('../models');
var utils = require('../utils');

/** GET Routes *********************************************************/
/** Get Main User Index Page */
router.get('/', function(req, res, next) {
	res.render('auth-index.jade', { title: 'Index'});
});

/** Get Main Register Page */
router.get('/register', function(req, res, next) {
	//res.render('auth-register.jade', { title: 'Register'});
	res.render('auth-register.jade', {  
		title: 'Register', 
		csrfToken: req.csrfToken() 
	});
});

/** Get Main Login Page */
router.get('/login', function(req, res, next) {
	//res.render('auth-login.jade', { title: 'Login'});
	res.render('auth-login.jade', {  
		title: 'Login', 
		csrfToken: req.csrfToken() 
	});
});

/** Get Main Logout Page */
router.get('/logout', function(req, res, next) {
	req.session.reset();
	res.redirect('/');
});

/** Post Routes ******************************************************/
router.post('/register', function(req, res) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.password, salt);

  var user = new models.User({
    firstName:  req.body.firstName,
    lastName:   req.body.lastName,
    email:      req.body.email,
    password:   hash,
  });
  
  user.save(function(err) {
    if (err) {
      var error = 'Something bad happened! Please try again.';
      if (err.code === 11000) {
        error = 'That email is already taken, please try another.';
      }
      res.render('auth-register.jade', { error: error });
    } else {
      utils.createUserSession(req, res, user);
      res.redirect('/dashboard');
    }
  });
});

router.post('/login', function(req, res) {
  models.User.findOne({ email: req.body.email }, 'firstName lastName email password data', function(err, user) {
    if (!user) {
      res.render('auth-login.jade', { error: "Incorrect email / password." });
    } else {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        utils.createUserSession(req, res, user);
        res.redirect('/dashboard');
      } else {
        res.render('auth-login.jade', { error: "Incorrect email / password."  });
      }
    }
  });
});

module.exports = router; //Export this router to the main app