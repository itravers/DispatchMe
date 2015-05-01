
	var app = angular.module("timePickerApp", []); 
	var timePickerScope;

	//ANGULAR STUFF=====================================================
	app.controller('timePickerCtrl', function($scope, $http) {
		$scope.pickedDate = "2015-04-29";
	      $scope.deactivatedDays = deactivatedDays;
		deactivateDays();
		
		function deactivateDays(){
			$('#datePicker').datepicker({
			    beforeShowDay: function(date){
			    	var array = $scope.deactivatedDays;
			        var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
			        return [ array.indexOf(string) == -1 ];
			    }
			});

			
		}
	});
	
$(function($scope) {
	
	
});
	




