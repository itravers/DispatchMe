/**
 * Name: dashboard.js
 * Author: Isaac Assegai
 * Date: 5/4/2015
 * Purpose: Keep track and control of the user dashboard.
 */
/** Angular App ******************************************************/

var ConfigurationsApp = angular.module("ConfigurationsApp", []);
var configAppScope;


/** Angular Controller ***********************************************/
ConfigurationsApp.controller('ConfigurationsCtrl', function($scope, $http, dataService) {
  $scope.submitAvailableLoginServicesClick = submitAvailableLoginServicesClick;
  $scope.submitAvailableSocialServicesClick = submitAvailableSocialServicesClick;
  configAppScope = $scope;
  
  /** Is Triggered for each minute in the timepicker 
   * @param selectedDate The date we are loading deactivated hours for */
    function submitAvailableSocialServicesClick($event) {
        var c = {};
        for(var i = 0; i < $scope.configs.length; i++){
          if($scope.configs[i].name == "AvailableSocialServices"){
            c = $scope.configs[i];
          }
        }
        //Our Data Service returns a promise and we then setup our timepicker.
        dataService.setData("/configuration/set", $scope.configs, $scope.csrfToken)
            .then(
              function( data){
               // alert("submittingAvailableLoginServicesClicked " + JSON.stringify(data));
                $scope.configs.statusText = data.statusText;
                if(data.statusTextColor){
                  $scope.configs.statusTextColor = data.statusTextColor;
                }else{
                  $scope.configs.statusTextColor = "Red";
                }
                
                //$scope.deactivatedHours = data.deactivatedHours;
                //setupTimePicker();
              }
        );
    }

  
  /** Is Triggered for each minute in the timepicker 
   * @param selectedDate The date we are loading deactivated hours for */
    function submitAvailableLoginServicesClick($event) {
        //Our Data Service returns a promise and we then setup our timepicker.
        dataService.setData("/configuration/set", $scope.configs, $scope.csrfToken)
            .then(
              function( data){
               // alert("submittingAvailableLoginServicesClicked " + JSON.stringify(data));
                $scope.configs.statusText = data.statusText;
                if(data.statusTextColor){
                  $scope.configs.statusTextColor = data.statusTextColor;
                }else{
                  $scope.configs.statusTextColor = "Red";
                }
                
                //$scope.deactivatedHours = data.deactivatedHours;
                //setupTimePicker();
              }
        );
    }
});


/** Angular Service *************************************************/
ConfigurationsApp.service(
    "dataService",
    function( $http, $q ) {
        return({
          getData: getData,
          setData: setData}); // Return public API.
        
        /* PUBLIC METHODS. */
        /** Ajax call that gets data about configs from the server
       * @param myurl The Address we are getting the data from.
       * @param configSetting The date we are asking date from. 
       * @returns {Array}*/
        function getData(myurl, configSetting) {
          //alert("getting data " + configSetting);
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
        function setData(myurl, configSetting, csrfToken) {
          
            var request = $http({
                method: "POST",
                url: myurl,
                data: {
                  configSetting: configSetting,
                  _csrf: csrfToken
                  }
                
                
            });
            //alert("setting data " + JSON.stringify(request));
            return(request.then(handleSuccess, handleError));
        }
        
        /* PRIVATE METHODS. */
        /** Transform the error response and unwrap the application dta from the API reponse.
       * @param response The API response.
       * @returns {Array} */
        function handleError(response) {
            /* Normalize the API reponse from the server if the server hasn't already done it. */
            if (!angular.isObject(response.data ) ||! response.data.message){
              //if(response.config.url === "/configuration/set"){
              configAppScope.configs.statusTextColor = "Red";
              configAppScope.configs.statusText = "Error Setting Configs: " + response.statusText;
             // }
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