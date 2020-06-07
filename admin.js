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


      $scope.name = new URLSearchParams(window.location.search).get('name');
        
      $scope.color = new URLSearchParams(window.location.search).get('color');

      $scope.room = new URLSearchParams(window.location.search).get('room');

      var rootref = firebase.database().ref().child($scope.room)


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
      var activePhaseRef = rootref.child('activeplayer').child('phase');
      var winnerRef = rootref.child('winner');




      

      var storytellerWatch = $firebaseObject(storyTellerRef).$watch(function() {
            var tellerobj = $firebaseObject(storyTellerRef);
            tellerobj.$loaded().then(function(){
                console.log(tellerobj.name)
                if(tellerobj.name!= $scope.name){
                    console.log('you are storyteller')
                    window.location.href = 'game.html?name='+ $scope.name+'&color='+ $scope.color+ '&room=' + $scope.room
                }
            })
        });


      $scope.replies = {};

      $scope.getreplies = function () {
        console.log("hi")
        return rootref.once('value').then(function (snapshot) {
          $scope.replies = snapshot.val()
          $scope.$apply()
        });
      }

      $firebaseObject(answerRef).$bindTo($scope, "answers").then(function () {
        console.log($scope.answers);
      });

      $firebaseObject(activePhaseRef).$bindTo($scope, "phase").then(function () {
        console.log($scope.phase);
      });

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

      winnerRef.on('value', function (snapshot) {
                    if (snapshot.val()) {
                      window.location.href = 'endgame.html?room='+ $scope.room + '&player=' + $scope.name + '&color=' + $scope.color
                    }
            });


      $scope.markOK = function (key, value) {

        document.getElementById(key+"+"+value+"ok").disabled = true;
        document.getElementById(key+"+"+value+"x").disabled = true;


        console.log(key + value)

        scoreRef.once('value').then(function (scoreShot) {
          console.log(scoreShot.val()[key])
          var originalscore = scoreShot.val()[key]
          return reverseSpecRef.child(key).once('value').then(function (snapshot) {
            var winscore = 4 - snapshot.val().charAt(0)
            var newscore = winscore + originalscore
            console.log(key + " " + newscore)
            return scoreRef.child(key).set(newscore).then((v) => { return newscore })
          }).then((value) => {
            return posBetRef.child(key).once('value').then(function (snapshot) {
              var better = snapshot.val()
              console.log(better)
              if (better == undefined || better == null) {
                return value
              }
              if (better == key) { betterscore = value }
              else { betterscore = scoreShot.val()[better] }
              console.log(betterscore)
              return scoreRef.child(better).set(betterscore + 1).then((v) => { return value })
            })
          }).then(value2 => {
            return negBetRef.child(key).once('value').then(function (snapshot) {
              var better = snapshot.val()
              console.log(better)
              if (better == undefined || better == null) {
                return Promise.resolve(1)
              }
              if (better == key) {
                betterscore = value2
              } else { betterscore = scoreShot.val()[better] }
              return scoreRef.child(better).set(betterscore - 1)
            })
          })
        }).then((value) => {
          answerRef.child(key).set(null)
        })
      }

      $scope.markWrong = function (key, value) {

        document.getElementById(key+"+"+value+"ok").disabled = true;
        document.getElementById(key+"+"+value+"x").disabled = true;

        console.log(key + value)

        scoreRef.once('value').then(function (scoreShot) {
          console.log(scoreShot.val()[key])
          var originalscore = scoreShot.val()[key]

          posBetRef.child(key).once('value').then(function (snapshot) {
              var better = snapshot.val()
              console.log(better)
              if (better == undefined || better == null) {
                return value
              }
              betterscore = scoreShot.val()[better] 
              console.log(betterscore)
              return scoreRef.child(better).set(betterscore + 1).then((v) => { return value })
            })
            .then(value2 => {
            return negBetRef.child(key).once('value').then(function (snapshot) {
              var better = snapshot.val()
              console.log(better)
              if (better == undefined || better == null) {
                return Promise.resolve(1)
              }
              betterscore = scoreShot.val()[better] 
              return scoreRef.child(better).set(betterscore - 1)
            })
          })
        }).then((value) => {
          answerRef.child(key).set(null)
        })

      }


    });

