angular.module("fwmApp")
    .controller("login-registerCtrl", function ($scope, $location, UsersFactory) {
        
        $scope.user = {}
        
        $scope.registerUser = function (newUser) {
            UsersFactory.registerWithEmail(newUser).then(
                $location.url("/userHome")
            )
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
    })