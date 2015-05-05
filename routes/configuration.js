var express = require('express');
var router = express.Router();
var utils = require('../utils');
var models = require('../models');
var sessions = require('client-sessions');

router.get('/', function(req, res, next){
  res.send(
      {error: "no error here"});
});

/* Post to set a config value. */
router.post('/set', function(req, res, next) {
  setConfigs(req, res, next);
  //console.log("god command to set configs "+ req);
	
});

function setConfigs(req, res, next){
  for(var i = 0; i < req.body.configSetting.length; i++){
    var configCategory = req.body.configSetting[i];
    var configCategoryToSave = new models.ConfigCategory({
      name: configCategory.name, 
      configs: configCategory.configs, 
      permissions: configCategory.permissions
    });
    
    configCategoryToSave.save(function(err) {
      if (err) {
        var error = 'Something bad happened! Please try again.';
        if (err.code === 11000) {
          error = 'That config is already in the DB?.';
        }
        res.send({
          statusText : error,
          statusTextColor : "Red"
        });
      } else {
        res.send({
          statusText : "Config Saved",
          statusTextColor : "Green"
        });
      }
    });
    
    //for(var n = 0; n < configCategory.length; n++){
      //var cFrontend = configCategory[n];
      //var configToSave = new models.Config({name: cFrontend.name, value: cFrontend.value});
    //}
    
    console.log("user submitted config category: " + configCategory.name);
  }
  
}


module.exports = router;
