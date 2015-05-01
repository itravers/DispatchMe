/**
 * Name: schedules.js
 * Author: Isaac Assegai
 * Date: 5/1/2015
 * Purpose: Establishes an API for querying and displaying Schedules..
 */

/** App Variables ******************************************************/
var express = require('express');
var router = express.Router();

/** GET Routes *********************************************************/

/** Get Main Scheduling Page */
router.get('/', function(req, res, next) {
	//Right now were just query the db for deactivated days and render that to the client.
	var deactivatedDays = getDeactivatedDays(req, res, true);
});

/** API CALL - Returns an Array of deactivated days to the client. */
router.get('/deactivatedDays.json', function(req, res, next){
	var deactivatedDays = getDeactivatedDays(req, res);
});

/** API CALL - Returns an Array of deactivated hours to the client. */
router.get('/deactivatedHours.json', function(req, res, next){
	var selectedDate = req.query.selectedDate;
	console.log("getting deactivedHours for date: " + selectedDate);
	getDeactivatedHours(selectedDate, req, res);
});

/** Helper Functions *************************************************/
/** This function will query the database for a list of deactivated hours it will send
  * JSON data back to the client
  * @param selectedDate The date we are getting these hours for.
  * @param req The http request and associated data
  * @param res The response we are sending back to the client
 */
function getDeactivatedHours(selectedDate, req, res){
	var db = req.db;
	var c = db.get('deactivatedHours'); //Using the collection deactivatedHours
	
	//Query the DB for date: selectedDate
	c.find({date: selectedDate},{}, function(e, docs){
		console.log("db.deactivatedHours.find(): ");
		if(docs.length >= 1){ //If we found a record matching selected date we'll send back info.
			res.send({ "deactivatedHours" : docs[0].hours});
		}else{ //We didn't find a record matching the selected date, send back empty array.
			res.send({ "deactivatedHours" : []});
		}
	});
}

/**
 * Query the db for a list of deactivated days. If this was called by an api call
 * then we will only send the data back, otherwise it was caused by a page load, and
 * we will render the entire page.
 * @param req The HTTP Request
 * @param res The HTTP Response
 * @param initialRender Boolean - set to true if this is an initial render.
 */
function getDeactivatedDays(req, res, initialRender){
	var db = req.db;
	var c = db.get('deactivatedDays'); //deactivatedDays collection
	
	//Query the db for ALL deactivated days.
	c.find({},{}, function(e, docs){
		console.log("db.deactivatedDays.find(): ");
		if(docs.length >= 1){//We found a matching record in the db, send data back to client
			if(!initialRender){//this is coming from an api request send data only.
				res.send({ "deactivatedDays" : docs[0].days});
			}else{ //this is coming from an initial load, render the entire page.
				res.render('scheduleTest', { title: 'Scheduling Tests', 
				   "deactivatedDays" : docs[0].days
				});
			}
		}else{ //We did not find a matching record in the db, send back an empty array.
			if(!initialRender){//this is coming from an api request, send data alone.
				res.send({ "deactivatedDays" : []});
			}else{ //this is coming from an initial page load, render entire page.
				res.render('scheduleTest', { title: 'Scheduling Tests', 
				   "deactivatedDays" : []
				});
			}
		}
	});
}

module.exports = router; //Export this router to the main app
