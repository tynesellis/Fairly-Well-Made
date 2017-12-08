angular.module("fwmApp")
    .controller("login-registerCtrl", function ($scope, $location, UsersFactory, userHomeFactory) {
        $scope.user = {}

        // Value of wants set for ng-if conditions of partials to include based on clicks of user
        $scope.wants = null;
        $scope.userWants = (whatTheyWant) => {
            if (whatTheyWant === '/login') {
                $location.url("/login")
            } else {$scope.wants = whatTheyWant};
        }

        $scope.registerUser = function (user) {
            UsersFactory.registerWithEmail(user).then(function () {
                $scope.userWants("setup")
            })
        }

        $scope.logoutUser = function () {
            UsersFactory.logout()
            $location.url('/')
        }

        $scope.loginUser = function (user) {
            UsersFactory.authenticate(user).then(function (didLogin) {
                $scope.user.email = {}
                $scope.user.password = {}
                $location.path("/userHome")
            })
        }

        $scope.authenticatedUser = {}

        $scope.setUpUser = function () {
            firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    const newUserObject = {
                        "uid": firebase.auth().currentUser.uid,
                        "firstName": $scope.authenticatedUser.firstName,
                        "lastName": $scope.authenticatedUser.lastName,
                        "streetNumber": $scope.authenticatedUser.streetNumber,
                        "streetName": $scope.authenticatedUser.streetName,
                        "city": $scope.authenticatedUser.city,
                        "state": $scope.authenticatedUser.state,
                        "zip": $scope.authenticatedUser.zip,
                        "pinterest": $scope.authenticatedUser.pinterest,
                        "venmo": $scope.authenticatedUser.venmo
                    }
                    userHomeFactory.add(newUserObject, idToken, "users")
                    $scope.authenticatedUser = {}
                    $location.url("/userHome")
                })
        }
    })