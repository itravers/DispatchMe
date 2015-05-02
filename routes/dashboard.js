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
var utils = require('../utils');
var models = require('../models');

/** Data Schema's *******************************************************/
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = mongoose.model('User');
/** Middleware **********************************************************/


/** GET Routes *********************************************************/
/** Get Dashboard Page */
router.get('/', utils.requireLogin, function(req, res, next) {
	res.render('dashboard.jade');
});


module.exports = router; //Export this router to the main app