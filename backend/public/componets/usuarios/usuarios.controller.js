app.controller('UsuariosController', function($scope, $q, $mdToast) {
    
    $scope.processosList = [
        
        {id:1, nome:'Saul Goodman',cargo:'Advogado', perfil:'Administrador', situacao:'Ativo'},
        {id:2, nome:'Pedro',cargo:'Estagiário', perfil:'Usuário', situacao:'Ativo'},
        {id:3, nome:'Ana',cargo:'Advogado', perfil:'Administrador', situacao:'Ativo'},
        {id:4, nome:'Giovani',cargo:'Estagiário', perfil:'Administrador', situacao:'Inativo'},
        {id:5, nome:'João',cargo:'Advogado', perfil:'Administrador', situacao:'Ativo'},
        {id:6, nome:'Giovani',cargo:'Advogado', perfil:'Administrador', situacao:'Ativo'},
        {id:7, nome:'John',cargo:'Estagiário', perfil:'Usuário', situacao:'Inativo'},
        {id:8, nome:'Lucia Carmem',cargo:'Advogado', perfil:'Administrador', situacao:'Ativo'},
        {id:9, nome:'Paulo Tamburine',cargo:'Advogado', perfil:'Administrador', situacao:'Inativo'},
        {id:10, nome:'Giovani',cargo:'Advogado', perfil:'Administrador', situacao:'Ativo'},
        {id:11, nome:'Giovani',cargo:'Advogado', perfil:'Administrador', situacao:'Inativo'},
        {id:12, nome:'Giovani',cargo:'Advogado', perfil:'Administrador', situacao:'Ativo'}

    ];        

     $scope.paginatorCallback = function(page, pageSize, options) {

        var filtersApplied = options.columnFilter;
        var offset = (page-1) * pageSize;
        var result =  $scope.processosList;

        return $q(function(resolve, reject){
            setTimeout(function(){
                resolve({
                    results: result.slice(offset, offset + pageSize),
                    totalResultCount: result.length
                });
            },300);
        });
    };

    $scope.goto = function(url) {
        location.href = url;
    }
    $scope.save = function() {
        $scope.showSimpleToast('Usuário salvo com sucesso!');
        $scope.goto('#usuarios');
    };
    var last = {
        bottom: true,
        top: false,
        left: false,
        right: true
    };

    $scope.toastPosition = angular.extend({},last);
    function sanitizePosition() {
        var current = $scope.toastPosition;

        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;

        last = angular.extend({},current);
      }

    $scope.getToastPosition = function() {
        sanitizePosition();

        return Object.keys($scope.toastPosition)
          .filter(function(pos) { return $scope.toastPosition[pos]; })
          .join(' ');
        };

        function sanitizePosition() {
        var current = $scope.toastPosition;

        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;

        last = angular.extend({},current);
    }
    $scope.showSimpleToast = function(msg) {
        var pinTo = $scope.getToastPosition();

        $mdToast.show(
          $mdToast.simple()
            .textContent(msg)
            .position(pinTo )
            .hideDelay(5000)
        );
    };

});
