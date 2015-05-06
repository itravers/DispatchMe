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
    //var i = 1;
    var configCategory = req.body.configSetting[i];
    
    models.ConfigCategory.findOneAndUpdate(
        {name: configCategory.name}, 
        configCategory, 
        {upsert:false}, 
        function(err, doc){
          if(err){
            console.log("sending error to dashboard i:"+i);
            res.send({
              statusText : err,
              statusTextColor : "Red"
            });
          }else{
            console.log("ready to send data checking loopNum:" + i);
            if(i == 0){//only send info the last loop
              console.log("sending data to dashboard i:"+i);
              res.json({
                statusText : "Config Saved",
                statusTextColor : "Green"
              });
            }
            
          }
        }
    );
    
    console.log("user submitted config category: " + configCategory.name + " loop#:" + i);
  }
  
}


module.exports = router;
