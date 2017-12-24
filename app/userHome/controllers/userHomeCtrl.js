angular.module("fwmApp")
    .controller("userHomeCtrl", function ($scope, $location, userHomeFactory, UsersFactory, $timeout, $route, Upload) {

        //store user info pulled from firebase
        $scope.userInfo = {}
        //flag for ng-if: changes when user info is retrieved
        $scope.loaded = "nope"

        //when the route changes to /userHome...
        $scope.$on('$routeChangeSuccess', function () {
            //..and firebase has stopped being wierd about authentication...
            firebase.auth().onAuthStateChanged(function (user) {
                if ($location.url() === "/userHome") {
                    //..get a fresh token...
                    firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            //..get the users section of firebase...
                            userHomeFactory.pull("users", idToken).then(users => {
                                //..set userInfo scope to the user that matches the logged in user
                                $scope.userInfo = users.find(user => user.uid === firebase.auth().currentUser.uid)
                                //change the ng-if flag so the content loads together
                                $scope.loaded = "yep"
                            })
                        })
                }
            })
        });

        //value affect ng-ifs of partials
        $scope.wants = ""
        //changes wants value on various clicks.  value passed from call in html
        $scope.userWants = (wants) => {
            $scope.wants = 0;
            $scope.wants = wants;
        }

    })

