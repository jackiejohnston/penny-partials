'use strict';

var PennyPartialsApp = angular.module('PennyPartialsApp', [
   'ngAnimate',
  //  'ngAria',
  //  'ngCookies',
  //  'ngMessages',
  //  'ngResource',
   'ngRoute',
  //  'ngSanitize',
  //  'ngTouch',
  'firebase'
]);

// ROUTING
PennyPartialsApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeController'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      })
      .when('/logout', {
        templateUrl: 'views/logout.html',
        controller: 'LogoutController'
      })
      .when('/jobs', {
        templateUrl: 'views/jobs.html',
        controller: 'JobsController'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);  
}]);


// ROOT SCOPE
PennyPartialsApp.run(function($rootScope) {
  $rootScope.loggedin = false;
});


// NAV CONTROLLER
PennyPartialsApp.controller('NavController', [
  function() {

  }
]);


// HOME CONTROLLER
PennyPartialsApp.controller('HomeController', ['$scope',
  function($scope) {
    $scope.pageClass = 'page-home';
  }
]);


// LOGIN CONTROLLER
PennyPartialsApp.controller('LoginController', ['$scope', '$rootScope', '$http', '$routeParams', '$location',
  function($scope, $rootScope, $http, $routeParams, $location) {
    $scope.pageClass = 'page-login';
    var ref = new Firebase('https://pennymac-snippets.firebaseio.com/');

    $scope.loginUser = function() {
      $scope.loginerror = false;
      $scope.errorMsg = '';
      ref.authWithPassword({
      email    : $scope.email,
      password : $scope.password
      }, function(error) { 
      // use 'function(error, authData)' instead if you want to return username or token
        if (error) 
        {
          $scope.loginerror = true;
          $scope.errorMsg = 'Login failed! ' + error.message;
          $rootScope.loggedin = false;
        } 
        else 
        {
          $rootScope.loggedin = true;
          $location.path('/');
          $scope.$apply();
        }
      });
    };
  }
]);


// LOGOUT CONTROLLER
PennyPartialsApp.controller('LogoutController', ['$scope', '$rootScope', 
  function($scope, $rootScope) {
    $scope.pageClass = 'page-logout';
    var ref = new Firebase('https://pennymac-snippets.firebaseio.com/');
    ref.unauth(); // This removes your Firebase write/update/delete ability
    $rootScope.loggedin = false;
  }
]);


// JOBS CONTROLLER
PennyPartialsApp.controller('JobsController', ['$scope', '$rootScope', '$http', '$routeParams', '$location', '$firebaseArray',
  function($scope, $rootScope, $http, $routeParams, $location, $firebaseArray) {
    if($rootScope.loggedin)
    {
      $scope.pageClass = 'page-jobs';
      var ref = new Firebase('https://pennymac-snippets.firebaseio.com/');
      var jobsRef = ref.child('jobs');
      $scope.jobs = $firebaseArray(jobsRef);
    } 
    else 
    {
      $location.path('/login');
    }

    $scope.addJob = function() {
      $scope.jobs.$add({ title: $scope.jobTitle, url: $scope.jobUrl });
      $scope.jobTitle = '';
      $scope.jobUrl = '';
    };

    $scope.updateJob = function(job) {
      $scope.jobs.$save(job);
    };

    $scope.removeJob = function(job) {
      $scope.jobs.$remove(job);
    };
  }
]);


    // var ref = new Firebase('https://<your-firebase>.firebaseio.com');
    // ref.createUser({
    //   email    : 'bobtony@firebase.com',
    //   password : 'correcthorsebatterystaple'
    // }, function(error, userData) {
    //   if (error) {
    //     console.log('Error creating user:', error);
    //   } else {
    //     console.log('Successfully created user account with uid:', userData.uid);
    //   }
    // });