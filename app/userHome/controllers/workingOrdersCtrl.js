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

        $scope.selectedOrder = null;
        $scope.selectOrder = () => {
            $scope.selectedOrder = event.target.id
        }
        $scope.uploadSketch = (newFile) => {
            alert("Got it!")
            const storageRef = firebase.storage().ref();
            const sketchRef = storageRef.child(newFile.name);
            const sketchImagesRef = storageRef.child(`images/${newFile.name}`);
            sketchRef.put(newFile).then(() => {
                sketchRef.getDownloadURL().then(newURL => {
                    firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            userHomeFactory.update(newURL, idToken, "orders", $scope.selectedOrder, "image")
                        })
                });
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

        $scope.setShipping = () => {
            userHomeFactory.setShipping();
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

        $scope.packingId = "";
        $scope.gotPaid = () => {
            debugger
            const clicked = event;
            firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    userHomeFactory.update(true, idToken, "orders", clicked.path[0].id, "paid").then(() => {
                        const message = document.createElement("h3");
                        message.innerHTML = "Payment marked recieved.  Buyer will be notified that shipping is imminent."
                        clicked.path[1].appendChild(message)
                        clicked.path[0].remove();
                    })
                })
        }
        $scope.packingSlipOrder = null;
        $scope.packingView = false;
        $scope.togglePacking = (b) => {
            const clicked = event;
            $scope.packingView = b
            $scope.packingSlipOrder = $scope.ordersBeingWorked.find(order => order.firebaseId === clicked.path[0].id)

        }

        $scope.updatedOrder = {}
        $scope.updateOrder = () => {
            const clicked = event;
            const orderId = event.target.id;
            const thisOrder = $scope.ordersBeingWorked.find(order => order.firebaseId === orderId) ||
                $scope.myOrders.find(order => order.firebaseId === orderId);
            firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    if ($scope.updatedOrder.comment !== undefined) {
                        $scope.updatedOrder.comment.id = $scope.userInfo.firstName;
                        thisOrder.comments = thisOrder.comments || [];
                        thisOrder.comments.push($scope.updatedOrder.comment);
                        userHomeFactory.update(thisOrder.comments, idToken, "orders", orderId, "comments")
                            .then($scope.updatedOrder.comment = "")
                    }
                    if ($scope.updatedOrder.price !== undefined) {
                        thisOrder.price = $scope.updatedOrder.price;
                        userHomeFactory.update(thisOrder.price, idToken, "orders", orderId, "price")
                            .then(() => {
                                $scope.updatedOrder.price = "";
                                const message = document.createElement("h3");
                                message.innerHTML = "Price proposed.  Check back for buyer's opinion."
                                clicked.path[1].appendChild(message);
                            })
                    }
                })
        }

    }
)