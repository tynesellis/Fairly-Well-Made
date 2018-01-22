angular.module("fwmApp").controller("headerCtrl",
    function ($scope, UsersFactory, $location) {
        //scope to control diplays in header of index.html based on login status
        $scope.loggedIn = false;

        //When the route changes
        $scope.$on('$routeChangeSuccess', function () {
            //if the user has completed registragion or login, set value to affect ng-ifs in index.html
            if ($location.url() === "/userHome") {
                $scope.loggedIn = true;
            }
            else {$scope.loggedIn = false}
        });

    })