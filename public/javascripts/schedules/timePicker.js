/**
 * New node file

 */


var app = angular.module("timePickerApp", []); 

//ANGULAR STUFF=====================================================
app.controller('timePickerCtrl', function($scope, $http, dataService) {
	$scope.pickedDate = "2015-04-29";
	$scope.deactivatedHours = "";
    $scope.deactivatedDays = deactivatedDays;
    $scope.timePickerOptions ={
        showPeriod: true,
        minutes: {
            interval: 15
        },
        onHourShow: function(hour){
        	if(isInArray(hour, $scope.deactivatedHours)){
        		return false;
        	}else{
        		return true;
        	}
        },
        onMinuteShow: function(hour, minute){
        	if ((hour == 20) && (minute >= 30)) { return false; } // not valid
            if ((hour == 6) && (minute < 30)) { return false; }   // not valid
            return true;  // valid
        },
        beforeShow: function(){
        	//loadDeactivatedHours("2015-04-29");
        }
    };
    //setupTimePicker();
    deactivateDays();
    
		
	function deactivateDays(){
		$('#datePicker').datepicker({
		    beforeShowDay: function(date){
		    	var array = $scope.deactivatedDays;
			    var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
			    return [ array.indexOf(string) == -1 ];
			},
			onSelect: function(selectedDate) {
				//
				loadDeactivatedHours(selectedDate);
				//$scope.timePicker.setTime(6);
				//$('#timePicker').timepicker('setTime', 6);
				//('#timePicker').showHour();
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
	
	 function loadDeactivatedHours(selectedDate) {
		 
	        // The friendService returns a promise.
	    	dataService.getData("/schedules/deactivatedHours.json", selectedDate)
	            .then(
	                function( data) {
	                	$scope.deactivatedHours = data.deactivatedHours;
	                	setupTimePicker();
	                	//setDeactivatedHours();
	                	//deactivateHours();
	                }
	            )
	        ;
	    	
	    }
	 
	 function setDeactivatedHours(){
		
	 }
	
});

app.service(
		"dataService",
        function( $http, $q ) {
			// Return public API.
            return({getData: getData});

            // ---
            // PUBLIC METHODS.
            // ---
            
            function getData(myurl, selectedDate) {
            	//alert("selectedDate " + selectedDate);
                var request = $http({
                    method: "get",
                    url: myurl,
                    params: {
                        action: "get",
                        selectedDate: selectedDate
                    }
                });
                return( request.then( handleSuccess, handleError ) );
            }


            // ---
            // PRIVATE METHODS.
            // ---


            // I transform the error response, unwrapping the application dta from
            // the API response payload.
            function handleError( response ) {
                // The API response from the server should be returned in a
                // nomralized format. However, if the request was not handled by the
                // server (or what not handles properly - ex. server error), then we
                // may have to normalize it on our end, as best we can.
                if (
                    ! angular.isObject( response.data ) ||
                    ! response.data.message
                    ) {
                    return( $q.reject( "An unknown error occurred." ) );
                }
                // Otherwise, use expected error message.
                return( $q.reject( response.data.message ) );
            }


            // I transform the successful response, unwrapping the application data
            // from the API response payload.
            function handleSuccess( response ) {
                return( response.data );
            }
        }
    );

function isInArray(value, array) {
	  return array.indexOf(value) > -1;
	}