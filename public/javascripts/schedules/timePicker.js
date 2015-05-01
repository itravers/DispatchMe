/**
 * Name: timePicker.js
 * Author: Isaac Assegai
 * Purpose: Keep track of and control the visual scheduling system.
 */

/** Angular App ******************************************************/
var app = angular.module("timePickerApp", []);

/** Angular Controller ***********************************************/
app.controller('timePickerCtrl', function($scope, $http, dataService) {
	$scope.deactivatedHours = "";
  $scope.deactivatedDays = deactivatedDays;
  deactivateDays(); //deactivate the days that are not available.
  $scope.timePickerOptions ={ //Options Used to set up the Time Picker
    showPeriod: true, // Shows AM or PM
    minutes: { 
    	interval: 15 // 15 shows 4 Minute slots per hour
    },
    /** Is triggered for each hour in the timepicker.
     	* @param hour The hour being drawn.
      * @returns {Boolean} True if we want it drawn, false if not. */
    onHourShow: function(hour){
    	if(isInArray(hour, $scope.deactivatedHours)){ //don't draw days that are in $scope.deactivatedHours
    		return false;
    	}else{
    		return true;
    	}
    },
    /** Is Triggered for each minute in the timepicker 
      * @param hour
      * @param minute
      * @returns {Boolean} True if we want to draw, false if not. */
    onMinuteShow: function(hour, minute){
    	if ((hour == 20) && (minute >= 30)) { return false; } // not valid
    	if ((hour == 6) && (minute < 30)) { return false; }   // not valid
	    return true;  // valid
    }
	};
		
	function deactivateDays(){
		$('#datePicker').datepicker({
			/** Is Triggered before the days are show
			  * @param date
			  * @returns {Array}*/
			beforeShowDay: function(date){
				var array = $scope.deactivatedDays;
				var string = jQuery.datepicker.formatDate('mm/dd/yy', date);
				return [ array.indexOf(string) == -1 ];
			},
			/** Is Triggered when a day is selected, trigs ajax call which updates timepicker
			 * @param selectedDate The day selected. */
			onSelect: function(selectedDate) {
				loadDeactivatedHours(selectedDate); //Start the ajax call and update timepicker
			}
		});
	}
	
	function setupTimePicker(){
		$('#timePicker').remove(); //remove timepicker and everything attached to it
		$( "#timePickerContainer" ).html( "<div id='timePicker'></div>"); //instantiate a new timepicker in the dom
		$('#timePicker').fadeOut();
		$('#timePicker').timepicker($scope.timePickerOptions);//wire up the new timepicker
		$('#timePicker').fadeIn();
		
		//$scope.timePicker = $('#timePicker');
		//$('#timePicker').onHourShow();
	}
	
	/** Is Triggered for each minute in the timepicker 
   * @param selectedDate The date we are loading deactivated hours for */
	function loadDeactivatedHours(selectedDate) {
		//Our Data Service returns a promise and we then setup our timepicker.
		dataService.getData("/schedules/deactivatedHours.json", selectedDate)
			.then(
			  function( data) {
			  	$scope.deactivatedHours = data.deactivatedHours;
			  	setupTimePicker();
			  }
		);
	}
}); //End timePickerCtrl

/** Angular Service *************************************************/
app.service(
	"dataService",
	function( $http, $q ) {
		return({getData: getData}); // Return public API.
		
		/* PUBLIC METHODS. */
		/** Ajax call that gets data about schedules from the server
	   * @param myurl The Address we are getting the data from.
	   * @param selectedDate The date we are asking date from. 
	   * @returns {Array}*/
		function getData(myurl, selectedDate) {
			var request = $http({
				method: "get",
				url: myurl,
				params: {
					action: "get",
					selectedDate: selectedDate
				}
			});
			return(request.then(handleSuccess, handleError));
		}
		
		/* PRIVATE METHODS. */
		/** Transform the error response and unwrap the application dta from the API reponse.
	   * @param response The API response.
	   * @returns {Array} */
		function handleError(response) {
			/* Normalize the API reponse from the server if the server hasn't already done it. */
			if (!angular.isObject(response.data ) ||! response.data.message){
				return( $q.reject( "An unknown error occurred." ) );
			}
			// Otherwise, use expected error message.
			return( $q.reject( response.data.message ) );
		}
		
		/** Transform the successful response and unwrap the app data from the payload.
	   * @param response The API response.
	   * @returns {Array} */
		function handleSuccess( response ) {
			return( response.data );
		}
	}
);

/** Helper Functions ***************************************************/
/** Returns true if the value is in the array.
 * @param value
 * @param array
 * @returns {Boolean} */
function isInArray(value, array) {
	return array.indexOf(value) > -1;
}