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

/** Helper Functions *************************************************/

module.exports = router; //Export this router to the main app