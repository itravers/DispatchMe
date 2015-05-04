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

/** MiddleWare ***********************************************************/

/** Needed by passport to serial user, we don't use it, but still need the stub*/
passport.serializeUser(function(user, done) {
  done(null, user);
});

/** Needed by passport to serial user, we don't use it, but still need the stub*/
passport.deserializeUser(function(user, done) {
  done(null, user);
});

/**
 * Facebook Strategy to login. Finds facebook ID and checks for it in our user database.
 * if it doesn't find it it will make a new user with that facebook id
 */
passport.use(new FacebookStrategy({
        clientID: "1576833329233718",
        clientSecret: "1ec1e145c288039ffcaf0087628332c0",
        callbackURL: "http://172.242.255.38:3000/users/login/auth/facebook/callback",
        //profileFields: ['id', 'name', 'emails'],
        enableProof: true,
        passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
    	console.log("profile: " + JSON.stringify(profile));
        //check user table for anyone with a facebook ID of profile.id
        models.User.findOne({
            facebook_id: profile.id
        },'firstName lastName email password data permissions'
        , function(err, user) {
            if (err) {
            	  console.log("error in facebook strategy");
                return done(err);
            }
            var email;
            if(!profile.emails){
            	email = profile.name.givenName + profile.name.familyName + "@dispatchmyself.com";
            }else{
            	email = profile.emails[0];
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                user = new models.User({
                	  facebook_id: profile.id,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: email,
                    password: bcrypt.hashSync("facebookPass", bcrypt.genSaltSync(10)),
                    username: profile.name.givenName+" "+profile.name.familyName,
                    provider: 'facebook',
                    permissions: ["user"]
                });
                //utils.createUserSession(req, user, res);
                user.save(function(err) {
                    if (err){
                    	console.log(err);
                    }
                    return done(err, user);
                });
            } else {
                //found user. Return
            		//utils.createUserSession(req, user);
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
    username: req.body.firstName + " " + req.body.lastName,
    provider: "dispatchmyself",
    permissions: ["user"]
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
//traditional route handler, passed req/res
router.get('/login/auth/facebook/callback', function(req, res, next) {
  // generate the authenticate method and pass the req/res
  passport.authenticate('facebook',{
  	scope: ['email'],},
  	function(err, user, info) {
    	if (err) { return next(err); }
    	if (!user) { return res.redirect('/'); 
    }
    	utils.createUserSession(req, res, user);
    	res.redirect('/dashboard');
  })(req, res, next);
});

router.post('/login', function(req, res) {
  models.User.findOne({ email: req.body.email }, 'firstName lastName email password data permissions', function(err, user) {
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