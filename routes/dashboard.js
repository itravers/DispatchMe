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
  getDataThenRender(req, res, next);
	
	
});

function getDataThenRender(req, res, next){
  getConfigsThenRender(req, res, next);
}

function getConfigsThenRender(req, res, next){
  //console.log("getting configs");
  models.ConfigCategory.find({}, {}, function(err, ConfigCategory) {
    //console.log(ConfigCategory);
    
    if (ConfigCategory.length == 0) {
      console.log("ConfigCategory isn't found");
      var config = new models.Config({
        name: "Facebook",
        value: true
      });
      var configArray = [];
      configArray.push({name: "Facebook", value: true});
      configArray.push({name: "DispatchMe", value: true});
      configArray.push({name: "Google", value: false});
      configArray.push({name: "Twitter", value: false});
      ConfigCategory = new models.ConfigCategory({
          name: "AvailableLoginServices",
          configs: configArray,
          permissions: ["GOD"]
      });
      //utils.createUserSession(req, user, res);
      ConfigCategory.save(function(err) {
        console.log("saving ConfigCategory");
          if (err){
            console.log("Error saving ConfigCategory: "+err);
          }
          //We just created a configcategory
      });
  } else {
    res.render('dashboard.jade', {
      configs: ConfigCategory,
      csrfToken: req.csrfToken()});
  }
  });
}


module.exports = router; //Export this router to the main app