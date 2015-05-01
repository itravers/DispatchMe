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
function getDeactivatedHours(selectedDate, req, res){
	console.log("getDeactivatedHours()");
	var db = req.db;
	var c = db.get('deactivatedHours');
	console.log("c: " + c);
	
	c.find({date: selectedDate},{}, function(e, docs){
		console.log("query db: " + docs);
		if(docs.length >= 1){
			res.send({ "deactivatedHours" : docs[0].hours});
		}else{
			res.send({ "deactivatedHours" : []});
		}
		
	});
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
	var deactivatedDays = getDeactivatedDays(req, res);
	res.send({ "deactivatedDays" : deactivatedDays});
});

router.get('/deactivatedHours.json', function(req, res, next){
	var selectedDate = req.query.selectedDate;
	console.log("getting deactivedHours for date: " + selectedDate);
	if(selectedDate == undefined){
		
	}//selectedDate = getDate();
	getDeactivatedHours(selectedDate, req, res);
	
});



module.exports = router;
