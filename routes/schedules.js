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

/* GET users listing. */
router.get('/', function(req, res, next) {
	//var deactivatedDays = ["2015-04-25","2015-04-27","2015-04-30"];
	var deactivatedDays = getDeactivatedDays();

	
	res.render('scheduleTest', { title: 'Scheduling Tests', 
		   "deactivatedDays" : deactivatedDays
		   });
});



module.exports = router;
