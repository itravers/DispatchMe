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
/** Middleware **********************************************************/


/** GET Routes *********************************************************/
/** Get Dashboard Page */
router.get('/', requireLogin, function(req, res, next) {
	res.render('dashboard.jade');
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