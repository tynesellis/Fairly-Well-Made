angular
    .module("fwmApp")
    .factory("userFactory", function ($http, firebase) {
        return Object.create(null, {
            "register": {
                value: user => {
                    return firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                }
            }
        })
    })