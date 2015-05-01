var express = require('express');
var router = express.Router();

/**
 * This function will query the database for a list of deactivated days.
 * @returns {Array} The list of deactivated days.
 */
function getDeactivatedDays(){
	var deactivatedDays = ["2015-04-25","2015-04-27","2015-04-30"];
	return deactivatedDays;
}

/**
 * This function will query the database for a list of deactivated hours.
 * @returns {Array} The list of deactivated hours.
 */
function getDeactivatedHours(){
	var deactivatedHours = [12, 13, 14, 15, 16];
	return deactivatedHours;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
	//var deactivatedDays = ["2015-04-25","2015-04-27","2015-04-30"];
	var deactivatedDays = getDeactivatedDays();
	res.render('scheduleTest', { title: 'Scheduling Tests', 
		   "deactivatedDays" : deactivatedDays
		   });
});

router.get('/deactivatedDays.json', function(req, res, next){
	var deactivatedDays = getDeactivatedDays();
	res.send({ "deactivatedDays" : deactivatedDays});
});

router.get('/deactivatedHours.json', function(req, res, next){
	var deactivatedHours = getDeactivatedHours();
	res.send({ "deactivatedHours" : deactivatedHours});
});



module.exports = router;
