const app = angular.module("fwmApp", ["ngRoute"]);


angular.module("fwmApp").config(function ($routeProvider){
    // Initialize Firebase
  const config = {
    apiKey: "AIzaSyCw5CMrrotePTU-CeSdJ2HkTPEb1V73MKw",
    authDomain: "fairly-well-made.firebaseapp.com",
    databaseURL: "https://fairly-well-made.firebaseio.com",
    projectId: "fairly-well-made",
    storageBucket: "fairly-well-made.appspot.com",
    messagingSenderId: "700188439393"
  };
  firebase.initializeApp(config);

    $routeProvider
    .when("/", {
        templateUrl: "app/login/partials/register-login.html",
        controller: "login-registerCtrl"
    })
    .when("/app/login/register", {
        templateUrl: "app/login/partials/register.html",
        controller: "login-registerCtrl"
    })
    .when("/app/login/login", {
        templateUrl: "app/login/partials/login.html",
        controller: "login-registerCtrl"
    })
})

