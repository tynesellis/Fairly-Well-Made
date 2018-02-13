angular.module("fwmApp")
    .controller("login-registerCtrl", function ($scope, $location, UsersFactory, userHomeFactory, $route) {
        $scope.user = {}

        // Value of wants set for ng-if conditions of partials to include based on clicks of user
        $scope.wants = null;
        $scope.userWants = (whatTheyWant) => {
            $location.url(whatTheyWant)
        }

        $scope.registerUser = function (user) {
            //form validation
            if (!user.email) { alert("Please enter a valid email address.") };
            if (!user.password) { alert("Please enter a password of at least six characters.") };
            if (user.email && user.password) {
                //if fields pass validation, register the user in firebase
                UsersFactory.registerWithEmail(user).then(function () {
                    //reset the user scope
                    $scope.user = {};
                    //send user to setup partial
                    $scope.wants = "setup"
                }).catch((error) => { alert(error.message) })
            }
        }
        //logout user function
        $scope.logoutUser = function () {
            UsersFactory.logout()
            $location.url('/')
        }
        //passes email and password entered by user to login through firebase authentication
        $scope.loginUser = function (user) {
            //if the fields are not filled out, notify the user
            if (!user.email || !user.password) { alert("Please fill in all fields.") }
            else {
                //if the fields are good, login the user through firebase
                UsersFactory.authenticate(user).then(function (didLogin) {
                    //reset user scope
                    $scope.user = {}
                    //send user to home page
                    $location.path("/userHome")
                }).catch((error) => {
                    //if firebase throws an error due to bad email or password, alert the user
                    alert(error.message)
                });
            }
        }

        //for Demo mode, allow users to sign in with the pre-made visitor credentials
        $scope.loginVisitor = function () {
            //pre-made visitor account
            $scope.user = {
                "email": "a@a.com",
                "password": "jjjjjj"
            };
            UsersFactory.authenticate($scope.user).then(function (didLogin) {
                $location.path("/userHome")
            })
        }
        //function to remove a selected item when needed
        $scope.hideMe = () => {
            event.path[0].remove()
        }
        //scope for new user information from userSetup.html
        $scope.newbie = {};

        //function to add user information to firebase database
        $scope.setUpUser = function () {
            //form validation to ensure all fields are filled out
            if (!$scope.newbie.firstName || !$scope.newbie.lastName || !$scope.newbie.streetNumber ||
                !$scope.newbie.streetName || !$scope.newbie.city || !$scope.newbie.state || !$scope.newbie.zip
                || !$scope.newbie.pinterest || !$scope.newbie.venmo) { alert("Please fill in all fields.") }
            else {
                //if all fields are filled out, create a new user object to be passed into firebase
                firebase.auth().currentUser.getIdToken(true)
                    .then(idToken => {
                        const newUserObject = {
                            "uid": firebase.auth().currentUser.uid,
                            "firstName": $scope.newbie.firstName,
                            "lastName": $scope.newbie.lastName,
                            "streetNumber": $scope.newbie.streetNumber,
                            "streetName": $scope.newbie.streetName,
                            "city": $scope.newbie.city,
                            "state": $scope.newbie.state,
                            "zip": $scope.newbie.zip,
                            "pinterest": $scope.newbie.pinterest,
                            "venmo": $scope.newbie.venmo
                        }
                        //set user info locally to be accessible from multiple controllers
                        UsersFactory.setUser(newUserObject);
                        //send new user to firebase storage
                        userHomeFactory.add(newUserObject, idToken, "users").then(() => {
                            $scope.newbie = {}
                            $route.reload();
                            $location.url("/pinAuth")
                        })
                    })
            }
        }
        $scope.pinAuthURL;
        $scope.getURL = () => {
            firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    userHomeFactory.getPinAuth(idToken).
                        then(response => { $scope.pinAuthURL = response.data; })
                })
        }
    })