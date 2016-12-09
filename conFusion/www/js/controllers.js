angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker) {

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


  $scope.registration = {};

  // Create the registration modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the registration modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the registration modal
    $scope.register = function () {
        $scope.registerform.show();
    };

    // Perform the registration action when the user submits the registration form
    $scope.doRegister = function () {
        // Simulate a registration delay. Remove this and replace with your registration
        // code if using a registration system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };

    $ionicPlatform.ready(function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
         $scope.takePicture = function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });

            $scope.registerform.show();

        };

        var optionsImgPck = {
            maximumImagesCount: 1,
            width: 100,
            height: 100,
            quality: 50
        };

        $scope.chooseFromGallery = function(){
            $cordovaImagePicker.getPictures(optionsImgPck)
            .then(function (results) {
                for (var i = 0; i < results.length; i++) {
                    $scope.registration.imgSrc = results[i];
                }
            }, function(error) {
                console.log('error getting photos');
            });
        }
    });    
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
                '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',  
                function ($scope, dishes, menuFactory, favoriteFactory, baseUrl, $ionicListDelegate, $ionicPlatform, 
                    $cordovaLocalNotification, $cordovaToast) {

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

                $ionicPlatform.ready(function () {
                    $cordovaLocalNotification.schedule({
                        id: 1,
                        title: "Added Favorite",
                        text: $scope.dishes[index].name
                    }).then(function () {
                        console.log('Added Favorite '+$scope.dishes[index].name);
                    },
                    function () {
                        console.log('Failed to add Notification ');
                    });

                    $cordovaToast
                    .show('Added Favorite '+$scope.dishes[index].name, 'long', 'center')
                    .then(function (success) {
                        // success
                    }, function (error) {
                        // error
                    });
                });
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
                        '$ionicModal', '$timeout', '$localStorage', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
                    function ($scope, $stateParams, dish, dishes, menuFactory, baseUrl, $ionicPopover, favoriteFactory, $ionicModal, $timeout, 
                        $localStorage, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

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
                
                $ionicPlatform.ready(function () {
                    $cordovaLocalNotification.schedule({
                        id: 1,
                        title: "Added Favorite",
                        text: $scope.dish.name
                    }).then(function () {
                        console.log('Added Favorite ' + $scope.dish.name);
                    },
                    function () {
                        console.log('Failed to add Notification ');
                    });

                    $cordovaToast
                    .show('Added Favorite '+ $scope.dish.name, 'long', 'center')
                    .then(function (success) {
                        // success
                    }, function (error) {
                        // error
                    });
                });

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
                    '$timeout', '$localStorage', 'favoritesFactory', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', 
                    '$cordovaVibration',
                function ($scope, dishes, baseUrl, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout, $localStorage, favoritesFactory, 
                    $ionicPlatform, $cordovaLocalNotification, $cordovaToast, $cordovaVibration) {

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
                    $cordovaVibration.vibrate(100);
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