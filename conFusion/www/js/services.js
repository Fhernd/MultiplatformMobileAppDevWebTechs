'use strict';

angular.module('conFusion.services', ['ngResource'])
        .constant("baseUrl", "http://192.168.0.10:3000/")
        .factory('menuFactory', ['$resource', 'baseUrl', function ($resource, baseUrl) {

            return $resource(baseUrl + "dishes/:id", null, { 
                'update': { method: 'PUT' } 
            });
        }])

        .factory('promotionFactory', ['$resource', 'baseUrl', function ($resource, baseUrl){
            return $resource(baseUrl + "promotions/:id");
        }])

        .factory('corporateFactory', ['$resource', 'baseUrl', function ($resource, baseUrl) {
            
            return $resource(baseUrl + "leadership/:id", null, { 'update': { method: 'PUT' } });
        }])

        .factory('feedbackFactory', ['$resource', 'baseUrl', function($resource, baseUrl) {
            var fbFactory = {};

            fbFactory.getFeedbacks = function() {
                return $resource(baseUrl + "feedback/:id", null, { 'update': { method: 'PUT' } });
            };

            return fbFactory;
        }])
        
        .factory('favoriteFactory', ['$resource', 'baseUrl', function ($resource, baseUrl){
            var favFac = {};
            var favorites = [];

            favFac.addToFavorites = function (index){
                for(var i = 0; i < favorites.length; ++i){
                    if (favorites[i].id == index){
                        return;
                    }
                }

                favorites.push({id: index});
            };

            favFac.deleteFromFavorites = function (index) {
                for (var i = 0; i < favorites.length; i++) {
                    if (favorites[i].id == index) {
                        favorites.splice(i, 1);
                    }
                }
            };

            favFac.getFavorites = function () {
                return favorites;
            };

            return favFac;
        }])
        .factory('$localStorage', ['$window', function($window) {
            return {
                store: function(key, value) {
                $window.localStorage[key] = value;
                },
                get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
                },
                storeObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
                },
                getObject: function(key,defaultValue) {
                return JSON.parse($window.localStorage[key] || defaultValue);
                },
                removeObject: function(key){
                    $window.localStorage.removeItem(key);
                }
            }
            }])
        .factory('favoritesFactory', ['$localStorage', function($localStorage){

            var ff = {};
            var favorites = [];

            ff.getFavorites = function(){
                for(var id = 0; id < 4; ++id){
                    if ($localStorage.getObject(id, -1) != -1){
                        favorites.push($localStorage.getObject(id, '{}'));
                    }
                }

                return favorites;
            };

            ff.removeFavorite = function(index){
                $localStorage.removeObject(index);
            }
            
            return ff;
        }] )
;