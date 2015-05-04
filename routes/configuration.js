var express = require('express');
var router = express.Router();

/* Post to set a config value. */
router.post('/set', function(req, res, next) {
	res.send({
	  error : "There was no error.",
	  body: req.body
	});
});

module.exports = router;
