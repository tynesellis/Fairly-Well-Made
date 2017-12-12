angular
    .module("fwmApp")
    .factory("userHomeFactory", function ($http) {
        return Object.create(null, {
            add: {
                value: function (newData, idToken, section) {
                    return $http({
                        method: "POST",
                        url: `https://fairly-well-made.firebaseio.com/${section}/.json?auth=${idToken}`,
                        data: newData
                    })
                }
            },
            pull: {
                value: function (section, idToken) {
                    return $http({
                        method: "GET",
                        url: `https://fairly-well-made.firebaseio.com/${section}/.json?auth=${idToken}`,
                    }).then(response => {
                        this.cache = Object.keys(response.data).map(key => {
                            response.data[key].firebaseId = key
                            return response.data[key]
                        })
                        return this.cache
                    })
                }
            },
            add: {
                value: function (newData, idToken, section, firebaseId, targetKey) {
                    return $http({
                        method: "PUT",
                        url: `https://fairly-well-made.firebaseio.com/${section}/${firebaseId}/${targetKey}/.json?auth=${idToken}`,
                        data: JSON.stringify(newData)
                    })
                }
            }

        })
    })
