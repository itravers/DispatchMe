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
var passport = require('passport')
, FacebookStrategy = require('passport-facebook').Strategy;


//Use facebook strategy
passport.use(new FacebookStrategy({
        clientID: "1576833329233718",
        clientSecret: "1ec1e145c288039ffcaf0087628332c0",
        callbackURL: "http://172.242.255.38:3000/users/login/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        //check user table for anyone with a facebook ID of profile.id
        models.User.findOne({
            'facebook.id': profile.id 
        }, function(err, user) {
            if (err) {
            	  console.log("error in facebook strategy");
                return next(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                user = new models.User({
                    firstName: profile.displayName,
                    lastName: "",
                    email: profile.emails[0].value,
                    password: "",
                    username: profile.username,
                    provider: 'facebook',
                    //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                    facebook: profile._json
                });
                user.save(function(err) {
                    if (err){
                    	console.log(err);
                    }
                    return done(err, user);
                });
            } else {
                //found user. Return
                return done(err, user);
            }
        });
    }
));

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

//Redirect the user to Facebook for authentication.  When complete,
//Facebook will redirect the user back to the application at
//  /auth/facebook/callback
router.post('/login/auth/facebook', passport.authenticate('facebook'));

//Facebook will redirect the user to this URL after approval.  Finish the
//authentication process by attempting to obtain an access token.  If
//access was granted, the user will be logged in.  Otherwise,
//authentication has failed.
router.get('/login/auth/facebook/callback', 
	passport.authenticate('facebook', { 
		successRedirect: '/users/',
		failureRedirect: '/users/login' }),function(req, res, next){
		  console.log("[OAuth2:redirect:query]:", JSON.stringify(req.query));
	    console.log("[OAuth2:redirect:body]:", JSON.stringify(req.body));
	    res.send("sucks");
	  }
);


/*router.get('/login/auth/facebook/callback', 
	  passport.authenticate('facebook', { successRedirect: '/',
	                                      failureRedirect: '/users/',
	                                      failureFlash: true}));
*/
/*router.get('/login/auth/facebook/callback', function(req, res){
	passport.authenticate('facebook', { 
		successRedirect: '/users/',
		failureRedirect: '/users/login' });
});
*/
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