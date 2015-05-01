/**
 * New node file

 */


var app = angular.module("timePickerApp", []); 
var timePickerScope;

//ANGULAR STUFF=====================================================
app.controller('timePickerCtrl', function($scope, $http) {
	$scope.pickedDate = "2015-04-29";
    $scope.deactivatedDays = deactivatedDays;
    deactivateDays();
    deactivateHours();
		
	function deactivateDays(){
		$('#datePicker').datepicker({
		    beforeShowDay: function(date){
		    	var array = $scope.deactivatedDays;
			    var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
			    return [ array.indexOf(string) == -1 ];
			}
		});
	}
	
	function deactivateHours(){
		$('#timePicker').timepicker({
	        showPeriod: true,
	        minutes: {
	            interval: 15
	        },
	        onHourShow: function(hour){
	        	if ((hour > 20) || (hour < 6)) {
	                return false; // not valid
	            }
	            return true; // valid
	        },
	        onMinuteShow: function(hour, minute){
	        	if ((hour == 20) && (minute >= 30)) { return false; } // not valid
	            if ((hour == 6) && (minute < 30)) { return false; }   // not valid
	            return true;  // valid
	        }
	    });
	}
	
});