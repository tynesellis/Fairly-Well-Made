angular.module("fwmApp").controller("NavCtrl",
function ($scope, UsersFactory) {

    $scope.isAuthenticated = () => UsersFactory.isAuthenticated();

    $scope.logout = () => UsersFactory.logout();

}
)