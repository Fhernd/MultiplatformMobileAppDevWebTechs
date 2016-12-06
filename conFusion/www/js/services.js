'use strict';

angular.module('conFusion.services', ['ngResource'])
        .constant("baseUrl", "http://localhost:3000/")
        .service('menuFactory', ['$resource', 'baseUrl', function ($resource, baseUrl) {

            this.getDishes = function () {

                return $resource(baseUrl + "dishes/:id", null, { 'update': { method: 'PUT' } });
            };

            // implement a function named getPromotion
            // that returns a selected promotion.
            this.getPromotions = function() {
                return $resource(baseUrl + "promotions/:id", null, { 'update': { method: 'PUT' } });
            };
        }])

        .factory('corporateFactory', ['$resource', 'baseUrl', function ($resource, baseUrl) {

            var corpFactory = {};

            corpFactory.getLeaders = function () {
                return $resource(baseUrl + "leadership/:id", null, { 'update': { method: 'PUT' } });
            }

            // Implement two functions, one named getLeaders,
            // the other named getLeader(index)
            // Remember this is a factory not a service


            return corpFactory;
        }])

        .factory('feedbackFactory', ['$resource', 'baseUrl', function($resource, baseUrl) {
            var fbFactory = {};

            fbFactory.getFeedbacks = function() {
                return $resource(baseUrl + "feedback/:id", null, { 'update': { method: 'PUT' } });
            };

            return fbFactory;
        }])

;
