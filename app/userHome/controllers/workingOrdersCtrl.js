angular.module("fwmApp").controller("workingOrdersCtrl",
    function ($scope, UsersFactory, userHomeFactory) {
        $scope.pages = 0;
        $scope.page = 0;
        $scope.lastPage = false;
        $scope.firstPage = true;

        $scope.ordersBeingWorked = []
        $scope.workingOrders = () => {
            //get a fresh token
            firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    //get orders from firebase
                    userHomeFactory.pull("orders", idToken).then(orders => {
                        const cuid = firebase.auth().currentUser.uid;
                        //filter out orders picked to work on by user
                        const filteredOrders = orders.filter(order => order.seller === cuid);
                        $scope.pages = filteredOrders.length;
                        $scope.ordersBeingWorked = filteredOrders;
                    })
                })
        }


        $scope.changePage = (direction) => {
            if (direction === "next" && $scope.page < ($scope.pages - 1)) {
                $scope.page += 1;
            } else if (direction === "back" && $scope.page !== 0) { $scope.page -= 1 }
            if (($scope.pages - 1) === $scope.page) {
                $scope.lastPage = true
            }
            else { $scope.lastPage = false }
            if ($scope.page !== 0) { $scope.firstPage = false }
            else { $scope.firstPage = true }
        }


    }
)