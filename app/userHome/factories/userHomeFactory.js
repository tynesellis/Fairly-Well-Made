angular
    .module("fwmApp")
    .factory("userHomeFactory", function ($http) {
        let shipping = {};
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
                    }).catch(()=> {return null})
                }
            },
            update: {
                value: function (newData, idToken, section, firebaseId, targetKey) {
                    return $http({
                        method: "PUT",
                        url: `https://fairly-well-made.firebaseio.com/${section}/${firebaseId}/${targetKey}/.json?auth=${idToken}`,
                        data: angular.toJson(newData)
                    })
                }
            },
            pins: {
                value: (user, board, authToken)=> {
                    return $http({
                        method: "GET",
                        url: `https://api.pinterest.com/v1/boards/${user}/${board}/pins/?access_token=${authToken}`,
                    }).catch(error => {return error})
                }
                
            },
            getPinsAuth: {
                value: function (idToken) {
                    return $http({
                        method: "GET",
                        url: `https://fairly-well-made.firebaseio.com/pinsAuth/.json?auth=${idToken}`,
                    }).then(response => {
                        return response;
                    })
                }
            },
            setShipping: {
                value: ()=>{
                    shipping = event.path[0].id;
                }
            },
            getShipping: {
                value: ()=>{
                    return shipping
                }
            },
            getPinAuth: {
                value: function (idToken) {
                    return $http({
                        method: "GET",
                        url: `https://fairly-well-made.firebaseio.com/pinterest/.json?auth=${idToken}`,
                    }).then(response => {
                        return response;
                    })
                }
            }

        })
    })
