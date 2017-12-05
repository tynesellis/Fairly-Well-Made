angular
    .module("fwmApp")
    .factory("userHomeFactory", function ($http) {
        return Object.create(null, {
            "add": {
                value: function (user, idToken) {
                    return $http({
                        method: "POST",
                        url: `https://fairly-well-made.firebaseio.com/users/.json?auth=${idToken}`,
                        data: user
                    })
                }
            }
        })
    })