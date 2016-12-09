angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userinfo','{}');

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $localStorage.storeObject('userinfo',$scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  // Reservation form: 
  $scope.reservation = {};

  // Create the reserve modal that we will use later
  $ionicModal.fromTemplateUrl('templates/reserve.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reserveform = modal;
  });

  // Triggered in the reserve modal to close it
  $scope.closeReserve = function() {
    $scope.reserveform.hide();
  };

  // Open the reserve modal
  $scope.reserve = function() {
    $scope.reserveform.show();
  };

  // Perform the reserve action when the user submits the reserve form
  $scope.doReserve = function() {
    console.log('Doing reservation', $scope.reservation);

    // Simulate a reservation delay. Remove this and replace with your reservation
    // code if using a server system
    $timeout(function() {
      $scope.closeReserve();
    }, 1000);
  };    
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('MenuController', ['$scope', 'dishes', 'menuFactory', 'favoriteFactory', 'baseUrl', '$ionicListDelegate', 
                function ($scope, dishes, menuFactory, favoriteFactory, baseUrl, $ionicListDelegate) {

            $scope.baseUrl = baseUrl;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;

            $scope.showMenu = false;
            $scope.message = "Loading...";

            $scope.dishes = dishes;

            $scope.select = function (setTab) {
                $scope.tab = setTab;

                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };

            $scope.toggleDetails = function () {
                $scope.showDetails = !$scope.showDetails;
            };

            $scope.addFavorite = function (index) {
                console.log("index is " + index);
                favoriteFactory.addToFavorites(index);
                $ionicListDelegate.closeOptionButtons();
            };
        }])

        .controller('ContactController', ['$scope', function ($scope) {

            $scope.feedback = { mychannel: "", firstName: "", lastName: "", agree: false, email: "" };

            var channels = [{ value: "tel", label: "Tel." }, { value: "Email", label: "Email" }];

            $scope.channels = channels;
            $scope.invalidChannelSelection = false;

        }])

        .controller('FeedbackController', ['$scope', 'feedbackFactory', function ($scope, $feedbackFactory) {

            $scope.sendFeedback = function () {

                console.log($scope.feedback);

                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {

                    $feedbackFactory.getFeedbacks().save($scope.feedback);

                    $scope.invalidChannelSelection = false;
                    $scope.feedback = { mychannel: "", firstName: "", lastName: "", agree: false, email: "" };
                    $scope.feedback.mychannel = "";
                    $scope.feedbackForm.$setPristine();
                }
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'dishes', 'menuFactory', 'baseUrl', '$ionicPopover', 'favoriteFactory', 
                        '$ionicModal', '$timeout', '$localStorage',
                    function ($scope, $stateParams, dish, dishes, menuFactory, baseUrl, $ionicPopover, favoriteFactory, $ionicModal, $timeout, $localStorage) {

            $scope.baseUrl = baseUrl;
            $scope.showDish = false;
            $scope.message = "Loading...";

            $scope.dish = dish;

            $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html',{
                scope: $scope}) 
                .then(function(popover){
                    $scope.popover = popover;
                });

            $scope.openPopover = function($event){
                $scope.popover.show($event);
            }

            $scope.closePopover = function() {
                $scope.popover.hide();
            }; 

            $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.commentModal = modal;
            });

            // Triggered in the reserve modal to close it
            $scope.closeAddComment = function() {
                $scope.commentModal.hide();
                $scope.closePopover();
            };

            // Open the reserve modal
            $scope.showCommentModal = function($event) {
                $scope.commentModal.show($event);
            };

            $scope.addFavorite = function (index) {
                //favoriteFactory.addToFavorites(index);
                $localStorage.storeObject($scope.dish.id, $scope.dish);
                $scope.closePopover();
            };

            $scope.comment = {};

            $scope.doComment = function(){
                $scope.comment.date = new Date().toISOString();
                $scope.comment.rating = parseInt($scope.comment.rating);

                $scope.dish.comments.push($scope.comment);
                
                $scope.closeAddComment();
            };
        }])

        .controller('DishCommentController', ['$scope', 'menuFactory', function ($scope, menuFactory) {

            //Step 1: Create a JavaScript object to hold the comment from the form:
            $scope.dishComment = { author: "", rating: 5, comment: "", date: "" };

            $scope.submitComment = function () {

                //Step 2: This is how you record the date
                var commentDate = new Date().toISOString();
                $scope.dishComment.date = commentDate;

                // Step 3: Push your comment into the dish's comment array:
                $scope.dish.comments.push($scope.dishComment);

                menuFactory.getDishes().update({ id: $scope.dish.id }, $scope.dish);

                //Step 4: reset your form to pristine:
                $scope.commentForm.$setPristine();

                //Step 5: reset your JavaScript object that holds your comment:
                $scope.dishComment = { author: "", rating: 5, comment: "", date: "" };
            }
        }])

        // implement the IndexController and About Controller here
        .controller('IndexController', ['$scope', 'dish', 'promotion', 'leader', 'baseUrl', 
                      function ($scope, dish, promotion, leader, baseUrl) {

            $scope.baseUrl = baseUrl;
            $scope.showDish = false;
            $scope.message = "Loading...";

            $scope.dish = dish;

            $scope.showPromotion = false;
            $scope.showPromotionMessage = "Loading..."; 

            $scope.promotion = promotion;

            $scope.showLeader = false;
            $scope.showLeaderMessage = "Loading...";

            $scope.leader = leader;
        }])

        .controller('AboutController', ['$scope', 'leaders', '$stateParams', 'corporateFactory', 'baseUrl', 
                    function ($scope, leaders, $stateParams, corporateFactory, baseUrl) {
            
            $scope.baseUrl = baseUrl;
            
            $scope.showLeaders = false;
            $scope.showLeadersMessage = "Loading...";

            $scope.leaders = leaders;
        }])

        .controller('FavoritesController', ['$scope', 'dishes', 'baseUrl', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', 
                    '$timeout', '$localStorage', 'favoritesFactory',
                function ($scope, dishes, baseUrl, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout, $localStorage, favoritesFactory) {

            $scope.baseUrl = baseUrl;
            $scope.shouldShowDelete = false;

            $scope.favorites = favoritesFactory.getFavorites();

            $scope.dishes = dishes;

            $scope.toggleDelete = function () {
                $scope.shouldShowDelete = !$scope.shouldShowDelete;
                console.log($scope.shouldShowDelete);
            };

            $scope.deleteFavorite = function (index) {

                var confirmPop = $ionicPopup.confirm({
                    title: 'Confirm Delete',
                    template: 'Are you sure you want to delete this item?'
                });

                confirmPop.then( function(res){
                    if (res){
                        console.log('OK to delete');
                        //favoriteFactory.deleteFromFavorites(index);
                        favoritesFactory.removeFavorite(index);

                    } else {
                        console.log('Canceled delete');
                    }
                });

                $scope.shouldShowDelete = false;

        };
}])

        .filter('favoriteFilter', function () {
            return function (dishes, favorites) {
                var out = [];
                for (var i = 0; i < favorites.length; i++) {
                    for (var j = 0; j < dishes.length; j++) {
                        if (dishes[j].id == favorites[i].id){
                            out.push(dishes[j]);
                        }
                    }
                }
                console.log(out.length);
                return out;
            }})
;