angular.module("fwmApp").controller("newOrder",
    function ($scope, UsersFactory, userHomeFactory) {

        //empty object for bound data of new order
        $scope.newOrder = {}
        //function to create new order and post it to firebase 'orders' section


        $scope.makeOrder = () => {
            const pins = [];
            userHomeFactory.pins($scope.userInfo.pinterest, $scope.newOrder.board.replace(/ /g, '-').toLowerCase())
                .then(response => {
                    response.data.data.forEach(pin => {
                        let eachPin = {
                            "image": pin.image.original.url,
                            "address": pin.url
                        }
                        pins.push(eachPin)
                    })
                }).then(() => {
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
                            userHomeFactory.add(newOrder, idToken, "orders")
                            //clear out newOrder
                            $scope.newOrder = {}
                            //reset want value to affect ng-ifs of home page
                            $scope.wants = ""
                        })
                })

        }

    }
)