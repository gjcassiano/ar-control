
'use strict';

var app = angular.module("jovas", ["ngMaterial", "ngMessages", "socialLogin", "ui.router"]);

//route
app.config(function($mdThemingProvider, $mdIconProvider, $stateProvider, $urlRouterProvider, socialProvider) {
    
    socialProvider.setGoogleKey("260610036183-8drccdgp9aa3svneeltgtbclujmt2sv1.apps.googleusercontent.com");

    $stateProvider.state('home', {
        url:'/home',
        templateUrl:'componets/home.html',
        controllerAs: "homeCtrl",
        controller:'HomeController',
        authenticate: true
    })
    .state('login', {
        url:'/login',
        templateUrl:'componets/login.html',
        controllerAs: "loginCtrl",
        controller:'LoginController',
        authenticate: false
    });

    $urlRouterProvider.otherwise('home');

    // $routeProvider
    // .otherwise({
    //     redirectTo: '/'
    // }).when("/", {
    //     controller: "HomeController",
    //     controllerAs: "homeCtrl",
    //     templateUrl: "componets/home.html"
    // })
    // .when("/login", {
    //     controller: "LoginController",
    //     controllerAs: "loginCtrl",
    //     templateUrl: "componets/login.html"
    // });

    $mdThemingProvider.definePalette('jovas', {
    '50': '#43526A',
    '100': '#f2f9fe',
    '200': '#bde1fc',
    '300': '#79c3f8',
    '400': '#5cb6f7',
    '500': '#43526A',
    '600': '#00CEC4',
    '700': '#0c8eeb',
    '800': '#0b7ccd',
    '900': '#096bb0',
    'A100': '#ffffff',
    'A200': '#f2f9fe',
    'A400': '#5cb6f7',
    'A700': '#0c8eeb',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 A100 A200 A400'
	});
	$mdThemingProvider.theme('default')
                    .primaryPalette('jovas');


   $mdIconProvider
      .iconSet("app:settings", 'imgs/settings.svg', 24)
      .iconSet("app:delete", 'imgs/delete.svg', 24)
      .iconSet("app:import_export", 'imgs/import_export.svg', 24)
      .iconSet("social", 'img/icons/sets/social-icons.svg', 24);
});

app.run(function($transitions, $state, $window){

    $transitions.onStart({}, function(trans) {

        var provider = $window.localStorage.getItem('_login_provider');
        if(!provider && trans.to().name !== 'login') {
            $state.go('login');
        }

    });
});
