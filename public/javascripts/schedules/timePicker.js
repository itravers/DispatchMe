/**
 * New node file
 */
$(function() {
	$('#timePicker').timepicker({
        showPeriod: true,
        onHourShow: OnHourShowCallback,
        onMinuteShow: OnMinuteShowCallback
    });
function OnHourShowCallback(hour) {
    if ((hour > 20) || (hour < 6)) {
        return false; // not valid
    }
    return true; // valid
}
function OnMinuteShowCallback(hour, minute) {
    if ((hour == 20) && (minute >= 30)) { return false; } // not valid
    if ((hour == 6) && (minute < 30)) { return false; }   // not valid
    return true;  // valid
}
});