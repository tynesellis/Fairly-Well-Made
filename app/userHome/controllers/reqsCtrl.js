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
                        $scope.pages = $scope.myOrders.length;
                    })
                })
        }

        $scope.approveOrder = (key) => {
            const orderId = event.target.id;
            const message = document.createElement("h3");

            if (key === 'approved') {
                message.innerHTML = "Order Approved! We'll notify the seller. Check back for updates";
            } else if (key === 'completed') {
                message.innerHTML = "Completed Order.  Come back when you have received payment to print a packing slip";
            }
            event.path[0].remove();
            event.path[1].appendChild(message);

            firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    userHomeFactory.update(true, idToken, "orders", orderId, key)
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

        $scope.updatedOrder = {}
        $scope.updateOrder = () => {
            const clicked = event;
            const orderId = event.target.id;
            const thisOrder = $scope.myOrders.find(order => order.firebaseId === orderId);
            firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    if ($scope.updatedOrder.comment !== undefined) {
                        $scope.updatedOrder.comment.id = $scope.userInfo.firstName;
                        thisOrder.comments = thisOrder.comments || [];
                        thisOrder.comments.push($scope.updatedOrder.comment);
                        userHomeFactory.update(thisOrder.comments, idToken, "orders", orderId, "comments")
                            .then($scope.updatedOrder.comment = "")
                    }
                })
        }
        
        $scope.demoPay = ()=>{alert("Normally, you would be taken to the seller's venmo page.  However, this is Demo Mode, so please don't pay anyone for anything.")}
    }
)