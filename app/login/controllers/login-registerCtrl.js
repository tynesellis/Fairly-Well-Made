angular.module("fwmApp")
    .controller("login-registerCtrl", function ($scope, $location, UsersFactory, userHomeFactory, $route) {
        $scope.user = {}

        // Value of wants set for ng-if conditions of partials to include based on clicks of user
        $scope.wants = null;
        $scope.userWants = (whatTheyWant) => {
            $location.url(whatTheyWant)
        }

        $scope.registerUser = function (user) {
            UsersFactory.registerWithEmail(user).then(function () {
                $scope.user = {};
                $scope.wants = "setup"
            })
        }

        $scope.logoutUser = function () {
            UsersFactory.logout()
            $location.url('/')
        }

        $scope.loginUser = function (user) {
            UsersFactory.authenticate(user).then(function (didLogin) {
                $scope.user = {}
                $location.path("/userHome")
            })
        }
        $scope.hideMe = ()=>{
            event.path[0].remove()
        }
        $scope.newbie = {}

        $scope.setUpUser = function () {
            firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    const newUserObject = {
                        "uid": firebase.auth().currentUser.uid,
                        "firstName": $scope.newbie.firstName,
                        "lastName": $scope.newbie.lastName,
                        "streetNumber": $scope.newbie.streetNumber,
                        "streetName": $scope.newbie.streetName,
                        "city": $scope.newbie.city,
                        "state": $scope.newbie.state,
                        "zip": $scope.newbie.zip,
                        "pinterest": $scope.newbie.pinterest,
                        "venmo": $scope.newbie.venmo
                    }
                    UsersFactory.setUser(newUserObject);
                    userHomeFactory.add(newUserObject, idToken, "users").then(() => {
                        $scope.newbie = {}
                        $route.reload();
                        $location.url("/userHome")
                    })
                })
        }
    })