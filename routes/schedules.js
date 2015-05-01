var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('scheduleTest', { title: 'Schedule Tests' });
});

module.exports = router;
