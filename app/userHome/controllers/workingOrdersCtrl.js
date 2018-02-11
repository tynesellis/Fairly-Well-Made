angular.module("fwmApp").controller("workingOrdersCtrl",
    function ($scope, UsersFactory, userHomeFactory) {
        //$scopes for pagination values called in $scope.changePage in this file
        $scope.pages = 0;
        $scope.page = 0;
        $scope.lastPage = false;
        $scope.firstPage = true;
        
        //array to hold orders being worked by the current users
        $scope.ordersBeingWorked = []
        //function called on load of this partial. Gets all orders in which the user is the seller
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

        //variable to hold the order in view when user clicks button to upload a file
        $scope.selectedOrder = null;
        //function that sets the id that will be passed into the uploadSketch file
        $scope.selectOrder = () => {
            $scope.selectedOrder = event.target.id
        }
        $scope.uploadSketch = (newFile) => {
            //If the file meets size standards, it will be passed in
            if (newFile) {
                //create variables to hold the references to the file
                //The end result is a URL that will be stored in the image key of the order
                const storageRef = firebase.storage().ref();
                const sketchRef = storageRef.child(newFile.name);
                const sketchImagesRef = storageRef.child(`images/${newFile.name}`);
                sketchRef.put(newFile).then(() => {
                    sketchRef.getDownloadURL().then(newURL => {
                        /*Once the new URL is made and returned from firebase, set the current order's image to the url
                        buy selecting that order from the ordersBeingWorked*/
                        $scope.ordersBeingWorked.find(o => o.firebaseId === $scope.selectedOrder).image = newURL;
                        //then get a fresh token from firebase
                        firebase.auth().currentUser.getIdToken(true)
                            .then(idToken => {
                                //and update the order's image key in firebase storage with the new URL
                                userHomeFactory.update(newURL, idToken, "orders", $scope.selectedOrder, "image")
                            })
                    });
                })
            }
            //If the file selected is greater than 1MB, it will not be passed in, so alert the user
            else (alert("Demo Mode has a maximum file upload size of 1MB.  Please use a smaller file or invest in Fairly, Well Made so we can buy more server space ;)"))
        }

        //pagination function.  Accepts "back" or "next" from the back or next button in html
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

        /*sets the value of shipping in userHomeFactory to the id of the order being viewed by the user
        so that the appropriate order gets displayed in the packing slip*/
        $scope.setShipping = () => {
            userHomeFactory.setShipping();
        }

        //Changes an order's status to approved or completed.  Accepts a string to indicate which
        $scope.approveOrder = (key) => {
            //id of the order being viewed during click
            const orderId = event.target.id;
            //begin creation of h3 that will hold a confirmation message
            const message = document.createElement("h3");
            //Add text to h3 based on the key passed to the function
            if (key === 'approved') {
                message.innerHTML = "Order Approved! We'll notify the seller. Check back for updates";
            } else if (key === 'completed') {
                message.innerHTML = "Completed Order.  Come back when you have received payment to print a packing slip";
            }
            //removed the button that was clicked
            event.path[0].remove();
            //add the messaged to the view
            event.path[1].appendChild(message);
            //get a fresh token from firebase
            firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    //changed the approved or completed status in firebase storage
                    userHomeFactory.update(true, idToken, "orders", orderId, key)
                })
        }
        
        //function to update order's paid status
        $scope.gotPaid = () => {
            //variable to hold what was clicked
            const clicked = event;
            firebase.auth().currentUser.getIdToken(true)
            //get a fresh token from firebase
                .then(idToken => {
                    //update the order's paid key
                    userHomeFactory.update(true, idToken, "orders", clicked.path[0].id, "paid").then(() => {
                        //create an h3 element to display an update to the user
                        const message = document.createElement("h3");
                        message.innerHTML = "Payment marked recieved.  Buyer will be notified that shipping is imminent."
                        //add the h3 to the view
                        clicked.path[1].appendChild(message);
                        //remove the button clicked
                        clicked.path[0].remove();
                    })
                })
        }
        //Holds value of order that will be updated
        $scope.updatedOrder = {}
        //function to update price and/or comments, depending on what is selected by the users
        $scope.updateOrder = () => {
            //variables to hold information on order that was in view at time of click
            const clicked = event;
            const orderId = event.target.id;
            const thisOrder = $scope.ordersBeingWorked.find(order => order.firebaseId === orderId);
            firebase.auth().currentUser.getIdToken(true)
            //get a fresh token from firebase
                .then(idToken => {
                    /*if the user submitted a comment, $scope.updatedOrder.comment will exist*/
                    if ($scope.updatedOrder.comment !== undefined) {
                        //label the comment with the user's first name
                        $scope.updatedOrder.comment.id = $scope.userInfo.firstName;
                        //set the comments to either what already exists or an empty array
                        thisOrder.comments = thisOrder.comments || [];
                        //add the comment to the current scope
                        thisOrder.comments.push($scope.updatedOrder.comment);
                        //update the order in persistent firebase storage
                        userHomeFactory.update(thisOrder.comments, idToken, "orders", orderId, "comments")
                            //clear the updatedOrder for later use
                            .then($scope.updatedOrder.comment = "")
                    }
                    //if the user has added a price
                    if ($scope.updatedOrder.price !== undefined) {
                        //update the order scope to show the price
                        thisOrder.price = $scope.updatedOrder.price;
                        //add the price to persistent storage in firebase
                        userHomeFactory.update(thisOrder.price, idToken, "orders", orderId, "price")
                            .then(() => {
                                //reset the updatedOrder scope for later use
                                $scope.updatedOrder.price = "";
                                //create an h3 and populate it with and update message for the user
                                const message = document.createElement("h3");
                                message.innerHTML = "Price proposed.  Check back for buyer's opinion."
                                //add the message to the view
                                clicked.path[1].appendChild(message);
                            })
                    }
                })
        }

    }
)