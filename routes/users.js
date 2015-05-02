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

/** Data Schema's *******************************************************/
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = mongoose.model('User');

//mongoose.connect('mongodb://localhost/DispatchMe');
/** Middleware **********************************************************/
router.use(bodyParser.urlencoded({extended: true}));
router.use(sessions({
	cookieName: 'session',
	secret: 'tyrannosaurusrex112358132134',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
}));

/*
router.use(function(req,res,next){
    if(req.session && req.session.user){
  		User.findOne({email: req.session.user.email}, function(err, user){
  			if(user){
  				req.user = user;
  				delete req.user.password;
  				req.session.user = user;
  				res.locals.user = user;
  			}
  			next();
  		});
  	}else{
  		next();
  	}
});
*/


/** GET Routes *********************************************************/
/** Get Main User Index Page */
router.get('/', function(req, res, next) {
	res.render('auth-index.jade', { title: 'Index'});
});

/** Get Main Register Page */
router.get('/register', function(req, res, next) {
	res.render('auth-register.jade', { title: 'Register'});
});

/** Get Main Login Page */
router.get('/login', function(req, res, next) {
	res.render('auth-login.jade', { title: 'Login'});
});

/** Get Main Logout Page */
router.get('/logout', function(req, res, next) {
	req.session.reset();
	res.redirect('/');
});



/** Post Routes ******************************************************/
router.post('/register', function(req, res){
	var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
	var user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: hash,
	});
	user.save(function(err){
		if(err){
			var error = 'An error has occurred. ';
			if(err.code === 11000){
				error = 'That Email is already taken, try another one.';
			}
			res.render('auth-register.jade', {error: error});
		}else{
			res.redirect('/dashboard');
		}
	});
});

router.post('/login', function(req, res){
	User.findOne({email: req.body.email}, function(err, user){
		if(!user){
			res.render('auth-login.jade', {error: 'Invalid email or password.'});
		}else{
			if(bcrypt.compareSync(req.body.password, user.password)){
				req.session.user = user; //set-coockie: session={email: '.', password: '.', etc:
				res.redirect('/dashboard');
			}else{
				res.render('auth-login.jade', {error: 'Invalid email or password.'});
			}
		}
	});
});

/** Helper Functions *************************************************/
function requireLogin(req, res, next){
	if(!req.user){
		res.redirect('/users/login');
	}else{
		next();
	}
}

module.exports = router; //Export this router to the main app