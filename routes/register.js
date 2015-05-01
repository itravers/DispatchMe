/**
 * Name: register.js
 * Author: Isaac Assegai
 * Date: 5/1/2015
 * Purpose: Establishes an API for Displaying and registering new registrations.
 */

/** App Variables ******************************************************/
var express = require('express');
var router = express.Router();

/** GET Routes *********************************************************/
/** Get Main Register Page */
router.get('/', function(req, res, next) {
	res.render('auth-register.jade', { title: 'Register'});
});

/** Helper Functions *************************************************/

module.exports = router; //Export this router to the main app