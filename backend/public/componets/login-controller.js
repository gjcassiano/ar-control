app.controller('LoginController', function($scope, $rootScope, $timeout, socialLoginService, $state) {

    var self = this;

    self.logout = logout;

    $rootScope.loading = true;

    function logout() {
        gapi.load('auth2', function() {
            gapi.auth2.getAuthInstance().signOut();
        });
        socialLoginService.logout();
    }

    $rootScope.$on('event:social-sign-in-success', function(event, userDetails){
        $state.go('home');
    });
    
    $rootScope.$on('event:social-sign-out-success', function(event, logoutStatus){
        $state.go('login');
        console.log(logoutStatus);        
    });
    
    $rootScope.isLoading = function() {
        return $rootScope.loading;
    };

    $scope.$on('$viewContentLoaded', function() {
        $timeout(function() { 
        	angular.element('loader-spinner').addClass("hidding");
            $timeout(function() { 
            	$scope.$apply(function(){
            		$rootScope.loading = false;
            	});
            },200); //900
        }, 100); //2000
    
    });

});