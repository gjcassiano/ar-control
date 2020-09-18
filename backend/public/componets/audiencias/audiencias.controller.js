app.controller('AudienciasController', function($scope, $q) {
    
    $scope.audienciasList = [
        
        {id:1, numero:'0002103-31.2012.0005',reclamante:'Giovani White', data:'20/03/2016', hora:'08:30',status:'Concluida'},
        {id:2, numero:'0002103-31.2012.0025',reclamante:'Joao Pinkman', data:'20/03/2016', hora:'13:30',status:'Aguardando'},
        {id:3, numero:'0002103-31.2012.0005',reclamante:'Giovani White', data:'20/03/2016', hora:'08:30',status:'Concluida'},
        {id:4, numero:'0002103-31.2012.0025',reclamante:'Joao Pinkman', data:'20/03/2016', hora:'13:30',status:'Aguardando'},
        {id:5, numero:'0002103-31.2012.0005',reclamante:'Giovani White', data:'20/03/2016', hora:'08:30',status:'Concluida'},
        {id:6, numero:'0002103-31.2012.0025',reclamante:'Joao Pinkman', data:'20/03/2016', hora:'13:30',status:'Aguardando'},
        {id:7, numero:'0002103-31.2012.0005',reclamante:'Giovani White', data:'20/03/2016', hora:'08:30',status:'Concluida'},
        {id:8, numero:'0002103-31.2012.0025',reclamante:'Joao Pinkman', data:'20/03/2016', hora:'13:30',status:'Aguardando'},
        {id:9, numero:'0002103-31.2012.0005',reclamante:'Giovani White', data:'20/03/2016', hora:'08:30',status:'Concluida'},
        {id:10, numero:'0002103-31.2012.0025',reclamante:'Joao Pinkman', data:'20/03/2016', hora:'13:30',status:'Aguardando'},
        {id:11, numero:'0002103-31.2012.0005',reclamante:'Giovani White', data:'20/03/2016', hora:'08:30',status:'Concluida'},
        {id:12, numero:'0002103-31.2012.0025',reclamante:'Joao Pinkman', data:'20/03/2016', hora:'13:30',status:'Aguardando'}

    ];        

     $scope.paginatorCallback = function(page, pageSize, options){

        var filtersApplied = options.columnFilter;
        var offset = (page-1) * pageSize;
        var result =  $scope.audienciasList;

        return $q(function(resolve, reject){
            setTimeout(function(){
                resolve({
                    results: result.slice(offset, offset + pageSize),
                    totalResultCount: result.length
                });
            },300);
        });
    };

});
