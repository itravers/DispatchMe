/**
 * Name: dashboard.js
 * Author: Isaac Assegai
 * Date: 5/4/2015
 * Purpose: Keep track and control of the user dashboard.
 */
/** Angular App ******************************************************/

var ConfigurationsApp = angular.module("ConfigurationsApp", []);


/** Angular Controller ***********************************************/
ConfigurationsApp.controller('ConfigurationsCtrl', function($scope, $http, dataService) {
  $scope.submitConfigsClick = submitConfigsClick;
  //$scope.configs = configs;
  //var hello = configs;
  ///$scope.configs = configs;
  /*var AvailableLoginServices = {
      'Facebook' : true,
      'DispatchMyself' : false,
      'Google' : false,
      'Twitter' : false};
  $scope.configs = {
      AvailableLoginServices: AvailableLoginServices,
      ChangePassword : true
      };
  */
  
  /** Is Triggered for each minute in the timepicker 
   * @param selectedDate The date we are loading deactivated hours for */
    function submitConfigsClick($event) {
        //Our Data Service returns a promise and we then setup our timepicker.
        dataService.getData("/configurations/set", $scope.configs)
            .then(
              function( data) {
                $scope.deactivatedHours = data.deactivatedHours;
                setupTimePicker();
              }
        );
    }
});


/** Angular Service *************************************************/
ConfigurationsApp.service(
    "dataService",
    function( $http, $q ) {
        return({getData: getData}); // Return public API.
        
        /* PUBLIC METHODS. */
        /** Ajax call that gets data about configs from the server
       * @param myurl The Address we are getting the data from.
       * @param configSetting The date we are asking date from. 
       * @returns {Array}*/
        function getData(myurl, configSetting) {
            var request = $http({
                method: "get",
                url: myurl,
                params: {
                    action: "get",
                    configSetting: configSetting
                }
            });
            return(request.then(handleSuccess, handleError));
        }
        
        /** Ajax call that posts data about configs to the server
       * @param myurl The Address we are posting the data to.
       * @param configSetting The date we are asking date from. 
       * @returns {Array}*/
        function setData(myurl, configSetting) {
            var request = $http({
                method: "post",
                url: myurl,
                params: {
                    action: "post",
                    configSetting: configSetting
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

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3&appId=1576833329233718";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));