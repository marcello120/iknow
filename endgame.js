
var firebaseConfig = {
    apiKey: "AIzaSyBMXeMh7yuvngbbLYl5ujib6T-T_SXOcTs",
    authDomain: "quiz-2414b.firebaseapp.com",
    databaseURL: "https://quiz-2414b.firebaseio.com",
    projectId: "quiz-2414b",
    storageBucket: "quiz-2414b.appspot.com",
    messagingSenderId: "733075302263",
    appId: "1:733075302263:web:78aacaeaf7080ff91be372",
    measurementId: "G-PK932EWZH5"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);



var app = angular.module('todoApp', ["firebase"]);

app.controller('todoController', function TodoCtrl($scope, $location, $firebaseArray, $firebaseObject) {



    $scope.name = new URLSearchParams(window.location.search).get('name');

    $scope.color = new URLSearchParams(window.location.search).get('color');

    $scope.room = new URLSearchParams(window.location.search).get('room');


    var rootref = firebase.database().ref().child($scope.room);

    var scoreRef = rootref.child('score');
    

    $firebaseObject(scoreRef).$bindTo($scope, "scorelist").then(function () {
        console.log($scope.scorelist);

        var maxscore = 0;
        angular.forEach($scope.scorelist, function (value, key) {
            if (key != '$id' && key != '$priority') {
                if (value >= maxscore) {
                    maxscore = value;
                }
            }
        });

        $scope.winner = [];
        angular.forEach($scope.scorelist, function (value, key) {
            if (key != '$id' && key != '$priority') {
                if (value == maxscore) {
                    $scope.winner.push(key)
                }
            }
        });
    });
});