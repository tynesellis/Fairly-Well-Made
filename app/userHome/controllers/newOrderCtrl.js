angular.module("fwmApp").controller("newOrder",
    function ($scope, UsersFactory, userHomeFactory, $timeout) {

        //empty object for bound data of new order
        $scope.newOrder = {}
        //function to create new order and post it to firebase 'orders' section
        $scope.pinAuth = "";
        $scope.init = () => {
            firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    userHomeFactory.getPinsAuth(idToken).then(response => {
                        debugger
                        $scope.pinAuth = response.data;
                    })
                });
        };

        $scope.makeOrder = () => {
            const pins = [];
            userHomeFactory.pins($scope.userInfo.pinterest, $scope.newOrder.board.replace(/ /g, '-').toLowerCase(), $scope.pinAuth)
                .then(response => {
                    response.data.data.forEach(pin => {
                        let eachPin = {
                            "image": pin.image.original.url,
                            "address": pin.url
                        }
                        pins.push(eachPin)
                    })
                }).catch(error => {
                    alert("Hmmmm.  That Inspiration Board Doesn't match what Pinterest has.");
                    $scope.newOrder = {};
                }).then(() => {
                    if (pins.length > 0) {
                        //get fresh token
                        firebase.auth().currentUser.getIdToken(true)
                            .then(idToken => {
                                //create order
                                const newOrder = {
                                    "buyer": $scope.userInfo.uid,
                                    "buyerName": $scope.userInfo.firstName,
                                    "pinterest": $scope.userInfo.pinterest,
                                    "board": $scope.newOrder.board.replace(/ /g, '-').toLowerCase(),
                                    "pins": pins,
                                    "description": $scope.newOrder.description,
                                    "size": $scope.newOrder.size,
                                    "seller": "Nobody yet"
                                }
                                //add to firebase: passes in new object, id token, and specifies section of firebase db
                                userHomeFactory.add(newOrder, idToken, "orders").then(
                                    //reset want value to affect ng-ifs of home page
                                    $timeout($scope.userWants('reqs'), 300))
                                //clear out newOrder
                                $scope.newOrder = {}
                            })
                    }
                })


        }

    }
)