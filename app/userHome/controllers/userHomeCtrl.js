angular.module("fwmApp")
    .controller("userHomeCtrl", function ($scope, $location, userHomeFactory, UsersFactory, $timeout, $route) {

        //store user info pulled from firebase
        $scope.userInfo = {}
        //flag for ng-if: changes when user info is retrieved
        $scope.loaded = "nope"

        //when the route changes to /userHome...
        $scope.$on('$routeChangeSuccess', function () {
            //..and firebase has stopped being wierd about authentication...
            firebase.auth().onAuthStateChanged(function (user) {
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
            })
        });

        //value affect ng-ifs of partials
        $scope.wants = ""
        //changes wants value on various clicks.  value passed from call in html
        $scope.userWants = (wants) => {
            $scope.wants = wants;
        }

        //empty object for bound data of new order
        $scope.newOrder = {}
        //function to create new order and post it to firebase 'orders' section
        $scope.makeOrder = () => {
            //get fresh token
            firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    //create order
                    const newOrder = {
                        "buyer": $scope.userInfo.uid,
                        "pinterest": $scope.userInfo.pinterest,
                        "board": $scope.newOrder.board,
                        "description": $scope.newOrder.description,
                        "size": $scope.newOrder.size,
                        "seller": "Nobody yet"
                    }
                    //add to firebase: passes in new object, id token, and specifies section of firebase db
                    userHomeFactory.add(newOrder, idToken, "orders")
                    //clear out newOrder
                    $scope.newOrder = {}
                    //reset want value to affect ng-ifs of home page
                    $scope.wants = ""
                })
        }

        //array of orders that match the user
        $scope.myOrders = [];
        $scope.getMyOrders = () => {
            //affects ng-if to show partial that will contain list of orders
            $scope.userWants("reqs")
            //get a fresh token
            firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    //get orders from firebase
                    userHomeFactory.pull("orders", idToken).then(orders => {
                        //filter out orders with a user id that match the id of the signed in user
                        $scope.myOrders = orders.filter(order => order.buyer === firebase.auth().currentUser.uid)
                    })
                })
        }

        //array of open orders
        $scope.erbodysOrders = [];
        $scope.takeOrders = () => {
            //affects ng-if to show partial that will contain list of open orders
            $scope.userWants("takeOrder")
            //get a fresh token
            firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    //get orders from firebase
                    userHomeFactory.pull("orders", idToken).then(orders => {
                        //filter out orders that haven't been picked up by a seller and aren't the requests of the current user
                        $scope.erbodysOrders = orders.filter(order => order.seller === "Nobody yet" && order.buyer !== firebase.auth().currentUser.uid)
                    })
                })
        }
        
        //ng-click function when a user wants to take on an order
        $scope.requestOrder = () => {
            //set firebaseID to id stored in button: will matched that of firebase order id
            let firebaseId = event.path[0].id;
            //get fresh token
            firebase.auth().currentUser.getIdToken(true)
            .then(idToken => {
                //add the current user as the seller in the order
                userHomeFactory.add(firebase.auth().currentUser.uid, idToken, "orders", firebaseId, "seller");
                $scope.wants = ""
            }) 
        }
        
        $scope.ordersBeingWorked = []
        $scope.workingOrders = ()=>{
            //affects ng-if to show partial that will contain list of working orders
            $scope.userWants("workingOrders")
            //get a fresh token
            firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    //get orders from firebase
                    userHomeFactory.pull("orders", idToken).then(orders => {
                        const cuid = firebase.auth().currentUser.uid;   
                        //filter out orders picked to work on by user
                        $scope.ordersBeingWorked = orders.filter(order => order.seller === cuid)
                    })
                })
        }

        $scope.sketch = null;
        $scope.addSketch = () => {
            let firebaseId = event.path[0].id;
            firebase.auth().currentUser.getIdToken(true)
            .then(idToken => {
                userHomeFactory.add($scope.sketch, idToken, "orders", firebaseId, "image");
            }) 
        }

        //When the user leaves the orders page...
        $scope.clearPin = () => {
            window.location.reload()
        }

    })


    /*The pinterest board widget require pinterest's javascript tag.  However, that tag cannot be included until the element it 
    affects (pinterest anchor widget on openReqs.html) has been written to the page.  This directive runs after that element
    has been written*/
    .directive('peInjectPinScript', function () {
        return function (scope) {
            //if the last ng-repeat cycle has completed
            if (scope.$last) {
                //create a new script
                const pinScript = document.createElement("script");
                //add the src, type, and two required booleans (script specs from pinterest's developer docs)
                pinScript.src = "//assets.pinterest.com/js/pinit.js";
                pinScript.type = "text/javascript";
                pinScript.async = true;
                pinScript.defer = true;
                //append script to doc
                document.getElementsByTagName("body")[0].appendChild(pinScript);
            };
        }
    })
