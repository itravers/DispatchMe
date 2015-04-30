$(function() {
	var array = ["2015-04-25","2015-04-27","2015-04-30"]

	$('#datePicker').datepicker({
	    beforeShowDay: function(date){
	        var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
	        return [ array.indexOf(string) == -1 ];
	    }
	});
});


