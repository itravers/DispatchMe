var express = require('express');
var router = express.Router();

/**
 * This function will query the database for a list of deactivated days.
 * @returns {Array} The list of deactivated days.
 */
function getDeactivatedDays(req, res, initialRender){
	var db = req.db;
	var c = db.get('deactivatedDays');
	
	c.find({},{}, function(e, docs){
		console.log("db.deactivatedDays.find(): ");
		if(docs.length >= 1){
			if(!initialRender){//this is coming from an api request
				res.send({ "deactivatedDays" : docs[0].days});
			}else{
				res.render('scheduleTest', { title: 'Scheduling Tests', 
				   "deactivatedDays" : docs[0].days
				   });
			}
		}else{
			if(!initialRender){//this is coming from an api request
				res.send({ "deactivatedDays" : []});
			}else{
				res.render('scheduleTest', { title: 'Scheduling Tests', 
				   "deactivatedDays" : []
				   });
			}
		}
	});
}

/**
 * This function will query the database for a list of deactivated hours.
 * @returns {Array} The list of deactivated hours.
 */
function getDeactivatedHours(selectedDate, req, res){
	var db = req.db;
	var c = db.get('deactivatedHours');
	
	c.find({date: selectedDate},{}, function(e, docs){
		console.log("db.deactivatedHours.find(): ");
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
	var deactivatedDays = getDeactivatedDays(req, res, true);
});

router.get('/deactivatedDays.json', function(req, res, next){
	var deactivatedDays = getDeactivatedDays(req, res);
	//res.send({ "deactivatedDays" : deactivatedDays});
});

router.get('/deactivatedHours.json', function(req, res, next){
	var selectedDate = req.query.selectedDate;
	console.log("getting deactivedHours for date: " + selectedDate);
	if(selectedDate == undefined){
		
	}//selectedDate = getDate();
	getDeactivatedHours(selectedDate, req, res);
	
});



module.exports = router;
