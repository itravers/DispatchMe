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
function getDeactivatedHours(selectedDate, req){
	console.log("getDeactivatedHours()");
	var db = req.db;
	var c = db.get('deactivatedHours');
	console.log("c: " + c);
	var doc;
	
	c.find({},{}, function(e, docs){
		console.log("query db: " + docs);
		doc = docs;
	});
	//var deactivatedHours = [12, 13, 14, 15, 16];
	console.log("returning doc.hours: " + doc);
	return doc.hours;
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
	var selectedDate = req.query.selectedDate;
	console.log("getting deactivedHours for date: " + selectedDate);
	if(selectedDate == undefined){
		
	}//selectedDate = getDate();
	var deactivatedHours = getDeactivatedHours(selectedDate, req);
	res.send({ "deactivatedHours" : deactivatedHours});
});



module.exports = router;
