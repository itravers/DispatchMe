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
	/*var AvailableLoginServices = {
			'Facebook' : true,
			'DispatchMyself' : true,
			'Google' : false,
			'Twitter' : false};
	var configs = {AvailableLoginServices: AvailableLoginServices};*/
  var configs = getConfigs();
	
	res.render('dashboard.jade', {
	  configs: configs,
	  csrfToken: req.csrfToken()});
});



function getConfigs(){
  console.log("getting configs");
  models.ConfigCategory.find({}, {}, function(err, ConfigCategory) {
    console.log(ConfigCategory);
    if (ConfigCategory.length == 0) {
      console.log("ConfigCategory isn't found");
      var config = new models.Config({
        name: "Facebook",
        value: true,
        permissions: ["GOD"]
      });
      var configArray = [];
      configArray.push(config);
      ConfigCategory = new models.ConfigCategory({
          name: "AvailableLoginServices",
          configs: configArray
      });
      //utils.createUserSession(req, user, res);
      ConfigCategory.save(function(err) {
        console.log("saving ConfigCategory");
          if (err){
            console.log(err);
          }
          //return done(err, user);
      });
  } else {
      //found user. Return
      //return done(err, user);
  }
  });
}


module.exports = router; //Export this router to the main app