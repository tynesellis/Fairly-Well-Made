angular.module("fwmApp")
    .controller("userHomeCtrl", function ($scope, $location, userHomeFactory, UsersFactory, $timeout, $route, Upload) {

        //store user info pulled from firebase
        $scope.userInfo = {}
        //flag for ng-if: changes when user info is retrieved
        $scope.loaded = "nope"

       //when the route changes to /userHome...
       $scope.$on('$routeChangeSuccess', function () {
        //..and firebase has stopped being wierd about authentication...
        firebase.auth().onAuthStateChanged(function (user) {
            if ($location.url() === "/userHome") {
                //..get a fresh token...
                firebase.auth().currentUser.getIdToken(true)
                    .then(idToken => {
                        //..get the users section of firebase...
                        userHomeFactory.pull("users", idToken).then(users => {
                            //..set userInfo scope to the user that matches the logged in user
                            $scope.userInfo = users.find(user => user.uid === firebase.auth().currentUser.uid)
                            //change the ng-if flag so the content loads together
                            $scope.loaded = "yep"
                        })
                    })
            }
        })
    });

        //value affect ng-ifs of partials
        $scope.wants = ""
        //changes wants value on various clicks.  value passed from call in html
        $scope.userWants = (wants) => {
            $scope.wants = 0;
            $scope.wants = wants;
        }

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
                                clicked.path[0].remove();
                                clicked.path[1].appendChild(message);
                            })
                    }
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
        $scope.printSlip = () => {
            print(event.path[1])
        }
        $scope.packingId = "";
        $scope.gotPaid = () => {
            const clicked = event;
            firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    userHomeFactory.update(true, idToken, "orders", clicked.path[0].id, "paid").then(() => {
                        clicked.path[0].remove();
                        const message = document.createElement("h3");
                        message.innerHTML = "Payment marked recieved.  Buyer will be notified that shipping is imminent."
                        clicked.path[1].appendChild(message)
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

    })

