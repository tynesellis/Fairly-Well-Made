angular.module("fwmApp").controller("takeOrdersCtrl",
    function ($scope, UsersFactory, userHomeFactory) {
        $scope.pages = 0;
        $scope.page = 0;
        $scope.lastPage = false;
        $scope.firstPage = true;

        //array of open orders
        $scope.erbodysOrders = [];
        $scope.takeOrders = () => {
            //get a fresh token
            firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    //get orders from firebase
                    userHomeFactory.pull("orders", idToken).then(orders => {
                        //filter out orders that haven't been picked up by a seller and aren't the requests of the current user
                        const filteredOrders = orders.filter(order => order.seller === "Nobody yet" && order.buyer !== firebase.auth().currentUser.uid);
                        $scope.pages = filteredOrders.length;
                        $scope.erbodysOrders = filteredOrders;
                    })
                })
        }

         //ng-click function when a user wants to take on an order
         $scope.requestOrder = () => {
            //set firebaseID to id stored in button: will matched that of firebase order id
            let buttonClicked = event;
            //get fresh token
            firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    //add the current user as the seller in the order
                    userHomeFactory.update(firebase.auth().currentUser.uid, idToken, "orders", buttonClicked.path[0].id, "seller")
                    userHomeFactory.update($scope.userInfo.firstName, idToken, "orders", buttonClicked.path[0].id, "sellerName")
                    userHomeFactory.update($scope.userInfo.venmo, idToken, "orders", buttonClicked.path[0].id, "sellerVenmo")
                    alert("It's Yours!!")
                    buttonClicked.path[1].remove()
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