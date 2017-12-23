angular.module("fwmApp").controller("headerCtrl",
    function ($scope, UsersFactory, $location) {
        $scope.loggedIn = false

        $scope.$on('$routeChangeSuccess', function () {
            if ($location.url() === "/userHome") {
                $scope.loggedIn = true;
            }
            else {$scope.loggedIn = false}
        });

    })