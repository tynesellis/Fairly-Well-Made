angular.module("fwmApp")
    .controller("shippingCtrl", function ($scope, $location, userHomeFactory, UsersFactory, $timeout, $route, Upload) {
        $scope.currentOrder = {};
        $scope.buyer = {};
        $scope.$on('$routeChangeSuccess', function () {
            if ($location.url() === "/shipping") {
                firebase.auth().currentUser.getIdToken(true)
                    .then(idToken => {
                        //..get the orders section of firebase...
                        userHomeFactory.pull("orders", idToken).then(orders => {
                            const selectedOrder = userHomeFactory.getShipping();
                            //..set currentOrder scope to the order that matches the selected order
                            $scope.currentOrder = orders.find(order => order.firebaseId === selectedOrder)
                            //..get the buyer's shipping info for the label and set the scope
                            $scope.buyer = userHomeFactory.pull("users", idToken).then(users => {
                                const theBuyer = users.find(user => user.uid === $scope.currentOrder.buyer);
                                $scope.buyer = theBuyer;
                            })
                        })
                    })
            }
        })

        $scope.printSlip = () => {
            print(event.path[1])
        }

    })

