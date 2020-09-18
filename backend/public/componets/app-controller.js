app.controller('HomeController', function($scope, $rootScope, $timeout, $mdConstant, $http, $mdDialog, socialLoginService, $state) {

    var self = this;

    self.logout = logout;

    self.slaves = [];
    self.getSlaves = getSlaves;
    self.init = init;
    self.ping = ping;
    self.editSlaveDialog = editSlaveDialog;
    self.removeSlaveDialog = removeSlaveDialog;
    self.createSubnetDialog = createSubnetDialog;
    self.removeSubnetDialog = removeSubnetDialog;

    self.checkSubnet = checkSubnet;

    self.subnets = [];

    $rootScope.loading = true;
    self.currentNavItem = 'page1';

    function logout() {
        gapi.load('auth2', function() {
            gapi.auth2.getAuthInstance().signOut();
        });
        socialLoginService.logout();
        $state.go('login');
    }

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
        }, 500); //2000
    
    });

    function getSlaves() {
        $http.get('/slaves').then(function(response){
            self.slaves = response.data;
        },function(error){
            console.log(error);
        });    
    }

    function init() {
        getSubnets();
        getSlaves();
    }

    function ping(mac) {
        $http.get('/slaves/' + mac+ '/ping' ).then(function(response){
            getSlaves();
        },function(error){
            console.log(error);
        }); 
    }

    function updateSlave(mac, attr) {
        $http.put('/slaves/' + mac, attr).then(function(response){
            getSlaves();
        },function(error){
            console.log(error);
        }); 
    }

    function removeSlave(mac) {
        $http.delete('/slaves/' + mac).then(function(response){
            getSlaves();
        },function(error){
            console.log(error);
        }); 
    }
    
    function getSubnets() {
        $http.get('/subnets').then(function(response){
            self.subnets = response.data;
        },function(error){
            console.log(error);
        }); 
    }

    function checkSubnet(name) {
        $http.post('/subnets/check', {name: name}).then(function(response){
            getSubnets();
            getSlaves();
        },function(error){
            console.log(error);
        }); 
    }

    function createSubnet(attr) {
        $http.post('/subnets', attr).then(function(response){
            getSubnets();
        },function(error){
            console.log(error);
        }); 
    }

    function removeSubnet(name) {
        $http.delete('/subnets/' + name).then(function(response){
            getSubnets();
        },function(error){
            console.log(error);
        }); 
    }

    function editSlaveDialog(ev, slave) {
        var confirm = $mdDialog.prompt()
          .title('Edit slave: ' + slave.mac)
          // .textContent('Bowser is a common name.')
          .placeholder('Slave name')
          .ariaLabel('Slave name')
          .initialValue(slave.name)
          .targetEvent(ev)
          .clickOutsideToClose(true)
          .required(true)
          .ok('save')
          .cancel('cancel');

        $mdDialog.show(confirm).then(function(name) {
            updateSlave(slave.mac, {name: name });
        });
    };

    function removeSlaveDialog(ev, slave) {
        var confirm = $mdDialog.confirm()
              .title('Remove slave?')
              .textContent('You will remove the slave ' + slave.mac + ', are you sure?')
              .targetEvent(ev)
              .ok('YES')
              .cancel('CANCEL');

        $mdDialog.show(confirm).then(function() {
            removeSlave(slave.mac);
        }, function() {
        });
    };

  
    function createSubnetDialog(ev) {
        var confirm = $mdDialog.prompt()
          .title('Create subnet')
          // .textContent('Bowser is a common name.')
          .placeholder('192.168.0.0/24')
          .ariaLabel('subnet name')
          .targetEvent(ev)
          .clickOutsideToClose(true)
          .required(true)
          .ok('save')
          .cancel('cancel');

        $mdDialog.show(confirm).then(function(name) {
            createSubnet({name: name});
            getSubnets();
        });
    };

    function removeSubnetDialog(ev, subnet) {
        var confirm = $mdDialog.confirm()
              .title('Remove subnet?')
              .textContent('You will remove the subnet ' + subnet + ', are you sure?')
              .targetEvent(ev)
              .ok('YES')
              .cancel('CANCEL');

        $mdDialog.show(confirm).then(function() {
            console.log(subnet);
            removeSubnet(subnet);
        }, function() {
        });
    };

});