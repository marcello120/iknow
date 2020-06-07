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

    app.controller('todoController', function TodoCtrl($scope, $location, $firebaseArray, $firebaseObject, $firebaseObject) {
        
      $scope.room = new URLSearchParams(window.location.search).get('room');

      var rootref = firebase.database().ref().child($scope.room);


      var basicBoard = {
        "negbet": {
          "11": "LightGray",
          "12": "LightGray",
          "21": "LightGray",
          "22": "LightGray",
          "31": "LightGray",
          "32": "LightGray",
        },
        "posbet": {
          "11": "LightGray",
          "12": "LightGray",
          "21": "LightGray",
          "22": "LightGray",
          "31": "LightGray",
          "32": "LightGray",
        },
        "specs": {
          "11": "LightGray",
          "12": "LightGray",
          "21": "LightGray",
          "22": "LightGray",
          "31": "LightGray",
          "32": "LightGray",
        }
      }

      var boardRef = rootref.child('board');
      var specRef = rootref.child('spec');
      var betRef = rootref.child('bets');
      var answerRef = rootref.child('answers');
      var scoreRef = rootref.child('score');
      var reverseSpecRef = rootref.child('reversespec');
      var posBetRef = rootref.child('bets').child('posbet');
      var negBetRef = rootref.child('bets').child('negbet');
      var storyTellerRef = rootref.child('storyteller');





      $scope.replies = {};

      $scope.getreplies = function () {
        console.log("hi")
        return rootref.once('value').then(function (snapshot) {
          $scope.replies = snapshot.val()
          $scope.$apply()
        });
      }


      $scope.clear = function () {
        console.log('clearing')
        boardRef.set(basicBoard)
        specRef.set(null)
        betRef.set(null)
        reverseSpecRef.set(null)
        answerRef.set(null)
        rootref.child('order').set(null)
        rootref.child('ready').set(null)
        rootref.child('activeplayer').set(null)
        rootref.child('storyteller').set(null)
        rootref.child('toggle').set(false)
        scoreRef.set(null)
      }

      $scope.reset = function () {
        //reset sets active player back to storyteller.next
        //reset sets phase back to spec
        boardRef.set(basicBoard)
        specRef.set(null)
        betRef.set(null)
        reverseSpecRef.set(null)
        answerRef.set(null)
      }


 


    });
