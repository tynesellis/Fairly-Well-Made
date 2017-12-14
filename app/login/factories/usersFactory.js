angular.module("fwmApp")
    .factory("UsersFactory", function ($http, $timeout, $location, userHomeFactory, $route) {
        let currentUserData = null
        let userProfile = null

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                currentUserData = user
                console.log("User is authenticated")

                $timeout(function () {
                    if ($location.url() !== "/register") {
                        $location.url("/userHome")
                    }
                }, 500)

            } else {
                currentUserData = null
                console.log("User is not authenticated")
                $timeout(function () {
                    $location.url("/")
                }, 500);
            }
        })

        return Object.create(null, {
            isAuthenticated: {
                value: () => {
                    const user = currentUserData
                    return user ? true : false
                }
            },
            getUser: {
                value: () => userProfile
            },
            logout: {
                value: () => firebase.auth().signOut()
            },
            authenticate: {
                value: credentials =>
                    firebase.auth()
                        .signInWithEmailAndPassword(
                        credentials.email,
                        credentials.password
                        )
            },
            registerWithEmail: {
                value: user =>
                    firebase.auth()
                        .createUserWithEmailAndPassword(
                        user.email,
                        user.password
                        )
            }
        })
    })