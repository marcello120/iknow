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


app.controller('todoController', ['$scope', '$location', '$firebaseArray', '$firebaseObject', function ($scope, $location, $firebaseArray, $firebaseObject) {

    var neutralColor = 'LightGray'

    var numbers = ["11", "12", "21", "22", "31", "32"]

    var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    $scope.name = new URLSearchParams(window.location.search).get('name');

    $scope.color = new URLSearchParams(window.location.search).get('color');

    $scope.room = new URLSearchParams(window.location.search).get('room');

    var rootref = firebase.database().ref().child($scope.room);

    $scope.hidebool = true;

    $scope.phase = {};

    $scope.score = 0;

    $scope.IsDisabled = false;

    $scope.disableNums = true;

    $scope.disableVote = true;

    var readyref = rootref.child('ready');

    var toggleref = rootref.child('toggle');

    var activeSetRef = rootref.child('activeplayer');

    var activePlayerRef = rootref.child('activeplayer').child('player');
    var activePhaseRef = rootref.child('activeplayer').child('phase');

    var storyTellerRef = rootref.child('storyteller');

    var answerRef = rootref.child('answers');

    var specRef = rootref.child('spec');

    var reverseSpecRef = rootref.child('reversespec');

    var boardRef = rootref.child('board');

    var betsRef = rootref.child('bets');

    var orderRef = rootref.child('order');

    var colorplayersRef = rootref.child('colorplayers');

    var winnerRef = rootref.child('winner');

    var orderhelperRef = rootref.child('orderhelper')

    winnerRef.on('value', function (snapshot) {
        if (snapshot.val()) {
            window.location.href = 'endgame.html?room=' + $scope.room + '&player=' + $scope.name + '&color=' + $scope.color
        }
    });

    toggleref.on('value', function (snapshot) {
        initOrder();
    });


    $scope.readypressed = 'btn btn-warning m-2';

    //hidebool object
    $firebaseObject(toggleref).$bindTo($scope, "hidebool").then(function () {
        console.log($scope.hidebool);
    });

    //showlist object
    $firebaseObject(colorplayersRef).$bindTo($scope, "showlist").then(function () {
        console.log($scope.showlist);
    });

    //phase object
    $firebaseObject(activePhaseRef).$bindTo($scope, "phase").then(function () {
        console.log($scope.phase);
    });

    //score object
    $firebaseObject(rootref.child('score').child($scope.name)).$bindTo($scope, "score").then(function () {
        console.log($scope.score);
    });

    //activeplayer object
    $firebaseObject(activePlayerRef).$bindTo($scope, "showactiveplayer").then(function () {
        console.log($scope.showactiveplayer);
    });

    //storyteller object
    $firebaseObject(storyTellerRef.child('name')).$bindTo($scope, "showstoryteller").then(function () {
        console.log($scope.showstoryteller);
    });

    var initOrder = function () {
        orderRef.child($scope.name).once('value', function (snapshot) {
            if (snapshot.exists()) {
                console.log("Player Detected")
            } else {
                toggleref.once('value', function (toggleshot) {
                    if (toggleshot.val() == true) {
                        alert("game already in progress")
                        window.location.href = 'https://www.google.com/search?q=I+dont+know+how+to+properly+authenticate+users&oq=I+dont+know+how+to+properly+authenticate+users'
                        return
                        //dont let new player enter game
                    } else {
                        registerPlayer()
                    }
                })
            }
        });
    }

    //called on page load
    function registerPlayer() {
        orderArray = $firebaseArray(orderRef)
        orderArray.$loaded().then(function () {

            if (orderArray.length > 6) {
                alert('Too many people in lobby')
                window.location.href = 'https://www.google.com/search?q=I+dont+know+how+to+properly+authenticate+users&oq=I+dont+know+how+to+properly+authenticate+users'
            }
            if (orderArray.length == 0) {
                var arr = { first: $scope.name, latest: $scope.name }
                orderhelperRef.set(arr).then(() => {
                    orderRef.child($scope.name).set("nothere")
                    alert("You are the only player in the room")
                })
            } else {
                orderhelperRef.once('value', function (snapshot) {
                    var helper = snapshot.val()
                    orderRef.child($scope.name).set(helper.first)
                    .then(()=>{
                        orderRef.child(helper.latest).set($scope.name)
                    }).then(()=>{
                        orderhelperRef.child('latest').set($scope.name)
                    })
                });
            }
            colorplayersRef.child($scope.name).set($scope.color)
            console.log("New Player Registered")
        })
    }

    $scope.ready = function () {
        if (!$scope.readybool) {
            readyref.child($scope.name).set('on')
            $scope.readybool = true;
            $scope.readypressed = "btn btn-success m-2"
        } else {
            readyref.child($scope.name).set(null)
            $scope.readybool = false;
            $scope.readypressed = 'btn btn-warning m-2';
        }
    }

    $scope.quit = function () {
        orderRef.child($scope.name).set(null).then((v) => {
            window.location.href = 'https://www.google.com/search?q=I+dont+know+how+to+properly+authenticate+users&oq=I+dont+know+how+to+properly+authenticate+users'
        })

    }



    var activePlayerWatch = $firebaseObject(activePlayerRef).$watch(function () {
        var playerobj = $firebaseObject(activePlayerRef);
        deactivateAllButtons();
        playerobj.$loaded().then(function () {
            if (playerobj.$value == $scope.name) {
                console.log('You are active player ' + playerobj.$value);
                var phaseobj = $firebaseObject(activePhaseRef);
                phaseobj.$loaded().then(function () {
                    if (phaseobj.$value == 'spec') {
                        activateSpecButtons()
                    }
                    if (phaseobj.$value == 'bet') {
                        activateBetButtons()
                    }
                })
            }
        })
    });


    var storytellerWatch = $firebaseObject(storyTellerRef).$watch(function () {
        var tellerobj = $firebaseObject(storyTellerRef);
        tellerobj.$loaded().then(function () {
            console.log(tellerobj.name)
            if (tellerobj.name == $scope.name) {
                console.log('you are storyteller')
                var random = Math.floor((Math.random() * 4) + 2);
                window.location.href = 'admin.html?name=' + $scope.name + '&color=' + $scope.color + '&room=' + $scope.room + '&random=' + random

            }
        })
    });


    var boardWatch = $firebaseObject(boardRef).$watch(function () {
        var boardobj = $firebaseObject(boardRef);
        boardobj.$loaded().then(function () {
            angular.forEach(boardobj.negbet, function (value, key) {
                document.getElementById(key + '-').style.background = value;
            });
            angular.forEach(boardobj.specs, function (value, key) {
                document.getElementById(key).style.background = value;
            });
            angular.forEach(boardobj.posbet, function (value, key) {
                document.getElementById(key + '+').style.background = value;
            });
        })

    });



    function deactivateAllButtons() {
        angular.forEach(numbers, function (value, key) {
            document.getElementById(value).disabled = true
            document.getElementById(value + '+').disabled = true
            document.getElementById(value + '-').disabled = true
        });
        console.log('Buttons Deactivated')
    }

    function activateSpecButtons() {
        boardRef.child('specs').once('value', function (snapshot) {
            console.log(snapshot.val())
            angular.forEach(snapshot.val(), function (value, key) {
                if (value == neutralColor) {
                    document.getElementById(key).disabled = false
                }
            });
        })
    }

    function activateBetButtons() {
        boardRef.child('posbet').once('value', function (posBets) {
            console.log(posBets.val())
            angular.forEach(posBets.val(), function (value, key) {
                if (value == neutralColor) {
                    document.getElementById(key + '+').disabled = false
                }
            });
        })
        boardRef.child('negbet').once('value', function (negBets) {
            console.log(negBets.val())
            angular.forEach(negBets.val(), function (value, key) {
                if (value == neutralColor) {
                    document.getElementById(key + '-').disabled = false
                }
            });
        })
        boardRef.child('specs').once('value', function (snapshot) {
            console.log(snapshot.val())
            angular.forEach(snapshot.val(), function (value, key) {
                if (value == neutralColor) {
                    document.getElementById(key + '-').disabled = true
                    document.getElementById(key + '+').disabled = true
                }
            });
        })
    }





    $scope.clickSpec = function (event) {
        setSpec(event.target.id)
        deactivateAllButtons()
        callnextplayer()
    };
    $scope.clickBet = function (event) {
        setBet(event.target.id)
        deactivateAllButtons()
        callnextplayer()
    };


    function setSpec(aid) {
        console.log('Setting Spec')
        boardRef.child('specs').child(aid).set($scope.color)
        specRef.child(aid).set($scope.name)
        reverseSpecRef.child($scope.name).set(aid)
    }

    function setBet(aid) {
        var betType = {}
        if (aid.includes('+')) {
            betType = 'posbet'
            console.log('Positive Bet')
        }
        if (aid.includes('-')) {
            betType = 'negbet'
            console.log('Negative Bet')
        }
        var position = aid.substring(0, aid.length - 1);

        boardRef.child(betType).child(position).set($scope.color)

        specRef.once('value', function (bettedonObject) {
            var person = bettedonObject.child(position).val()
            if (person == null) {
                return
            }
            betsRef.child(betType).child(person).set($scope.name);
        })
    }

    function callnextplayer() {
        orderRef.once('value', function (order) {
            const nextone = order.val()[$scope.name]
            storyTellerRef.once('value', function (teller) {
                var nextcandidate = {}
                console.log(teller.val().name)
                console.log(nextone)
                if (teller.val().name == nextone) {
                    activePhaseRef.once('value', function (phase) {
                        if (phase.val() == 'spec') {
                            activePhaseRef.set('bet');
                            nextcandidate = teller.val().next
                        } else {
                            activePhaseRef.set('answer');
                            nextcandidate = teller.val().name
                        }
                    })
                } else {
                    nextcandidate = nextone
                }
                activePlayerRef.set(nextcandidate)
            })
        })
    }

    $scope.tasks = "Write";
    $scope.addname = function () {
        $scope.tasks.push($scope.title);
    }

    $scope.submitanswer = function (aanswer) {
        if (aanswer != undefined && aanswer != "" && aanswer != " " && !format.test(aanswer)) {
            $scope.tasks = "Your answer is: " + aanswer
            answerRef.child($scope.name).set(aanswer)
        } else {
            alert("invalid answer")
        }
    }

}]);