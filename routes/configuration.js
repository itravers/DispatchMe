var express = require('express');
var router = express.Router();
var utils = require('../utils');
var sessions = require('client-sessions');

router.get('/', function(req, res, next){
  res.send(
      {error: "no error here"});
});

/* Post to set a config value. */
router.post('/set', function(req, res, next) {
  console.log("god command to set configs ");
	res.send({
	  error : "There was no error.",
	  body: req.body
	});
});

module.exports = router;
