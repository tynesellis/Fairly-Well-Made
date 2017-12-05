angular.module("fwmApp")
    .controller("userHomeCtrl", function ($scope, $location, userHomeFactory) {
        $scope.user = {}

        $scope.setUpUser = function () {
            firebase.auth().currentUser.getToken(true)
                .then(idToken => {
                    debugger
                    const newUser = {
                        "uid": currentUser.uid,
                        "firstName": $scope.user.firstName,
                        "lastName": $scope.user.lastName,
                        "streetNumber": $scope.user.streetNumber,
                        "streetName": $scope.user.streetName,
                        "city": $scope.user.city,
                        "state": $scope.user.state,
                        "zip": $scope.user.zip,
                        "pinterest": $scope.user.pinterest,
                        "venmo": $scope.user.venmo
                    }

                    userHomeFactory.add($scope.user, idToken)

                })



        }
    })