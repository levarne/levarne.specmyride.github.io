// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('specmyride', ['ionic','ngSanitize', 'specmyride.controller', 'specmyride.services'])

.run(function($ionicPlatform, $rootScope, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

        $rootScope.$on('loading:show', function() {
            $ionicLoading.show(
                {
                    template: '<ion-spinner icon="ios-small"></ion-spinner>',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                })
        })

        $rootScope.$on('loading:hide', function() {
            $ionicLoading.hide();
            /*
             $timeout(function () {
             $ionicLoading.hide();
             }, 200);
             */
        })
})

    .config(function($stateProvider, $urlRouterProvider){
      $stateProvider

          .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
          })

          .state('tab.categories', {
            url: '/categories',
            views: {
              'tab-categories': {
                templateUrl: 'templates/categories.html',
                controller: 'categoriesCtrl'
              }
            }
          })

          .state('tab.categories-model', {
            url: '/categories-model/:makeId/:makeName',
            views: {
              'tab-categories': {
                templateUrl: 'templates/categories.model.html',
                controller: 'vehicleModelCtrl'
              }
            }
          })

          .state('tab.model-showcase', {
            url: '/categories-model-showcase/:makeName/:styleId',
            views: {
              'tab-categories':{
                templateUrl: 'templates/model.showcase.html',
                controller: 'ModelShowcaseCtrl'
              }
            }
          })

          .state('tab.model-article', {
            cache: false,
            url: '/categories-article',
            views: {
              'tab-article':{
                templateUrl: 'templates/model.article.html',
                controller: 'ModelArticleCtrl'
              }
            }
          })

          .state('tab.model-review', {
            cache: false,
            url: '/categories-review',
            views: {
              'tab-review':{
                templateUrl: 'templates/model.review.html',
                controller: 'ModelReviewCtrl'
              }
            }
          })

          .state('tab.about', {
            cache: false,
            url: '/about',
            views: {
                'tab-about': {
                    templateUrl: 'templates/about.html'
                }
            }
          })

      $urlRouterProvider.otherwise('/tab/categories');
    })


    .config(function($httpProvider) {
      $httpProvider.interceptors.push(function($rootScope) {
        return {
          request: function(config) {
            $rootScope.$broadcast('loading:show')
            return config
          },
          response: function(response) {
            $rootScope.$broadcast('loading:hide')
            return response
          }
        }
      })
    })

    .config(['$ionicConfigProvider', function($ionicConfigProvider) {
      $ionicConfigProvider.tabs.position('top');//other values: top
      $ionicConfigProvider.tabs.style('standard');

      if (ionic.Platform.isAndroid()) {
        $ionicConfigProvider.scrolling.jsScrolling(false);
      }
    }]);