angular.module("fwmApp").controller("reqsCtrl",
    function ($scope, UsersFactory, userHomeFactory) {
        $scope.pages = 0;
        $scope.page = 0;
        $scope.lastPage = false;
        $scope.firstPage = true;
        //array of orders that match the user
        $scope.myOrders = [];
        $scope.getMyOrders = () => {
            //get a fresh token
            firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    //get orders from firebase
                    userHomeFactory.pull("orders", idToken).then(orders => {
                        //filter out orders with a user id that match the id of the signed in user
                        $scope.myOrders = orders.filter(order => order.buyer === firebase.auth().currentUser.uid)
                        debugger
                        $scope.pages = $scope.myOrders.length;
                    })
                })
        }

        $scope.changePage = (direction) => {
            if (direction === "next" && $scope.page < ($scope.pages -1)) {
                $scope.page += 1;
            } else if (direction === "back" && $scope.page !== 0)
            {$scope.page -= 1}
            if (($scope.pages -1) === $scope.page) {
                $scope.lastPage = true
            }
            else {$scope.lastPage = false}
            if ($scope.page !== 0) {$scope.firstPage = false}
            else {$scope.firstPage = true}
        }
        

    }
)