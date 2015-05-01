/**
 * Name: users.js
 * Author: Isaac Assegai
 * Date: 5/1/2015
 * Purpose: Establishes an API for Interacting with user information
 * 	        this includes registering, logging in, etc.
 */

/** App Variables ******************************************************/
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

/** Data Schema's *******************************************************/
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = mongoose.model('User', new Schema({
	id: ObjectId,
	firstName: String,
	lastName: String,
	email: {type: String, unique: true},
	password: String,
}));

mongoose.connect('mongodb://localhost/DispatchMe');
/** Middleware **********************************************************/
router.use(bodyParser.urlencoded({extended: true}));

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
	res.redirect('/');
});

/** Get Main Register Page */
router.get('/dashboard', function(req, res, next) {
	res.render('dashboard.jade', { title: 'dashboard'});
});

/** Post Routes ******************************************************/
router.post('/register', function(req, res){
	var user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password,
	});
	user.save(function(err){
		if(err){
			var error = 'An error has occurred. ';
			if(err.code === 11000){
				error = 'That Email is already taken, try another one.';
			}
			res.render('auth-register.jade', {error: error});
		}else{
			res.redirect('/users/dashboard');
		}
	});
});

/** Helper Functions *************************************************/

module.exports = router; //Export this router to the main app