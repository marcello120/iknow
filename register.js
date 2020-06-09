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


            $scope.room = new URLSearchParams(window.location.search).get('room');

            $scope.qrsource="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://marcello120.github.io/iknow/register.html?room="+ $scope.room

            var rootref = firebase.database().ref().child($scope.room);

            var colorRef = rootref.child('colors');

            $scope.colordrop = "Select a Color";

            var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

            $scope.color = ""

            $scope.colorlist={}

            $firebaseObject(colorRef).$bindTo($scope, "colorlist").then(function () {
                console.log($scope.colorlist);
            });

            $scope.go = function (aname, acolor, aroom) {
                console.log(aroom)

                if (aname != undefined && aname != "" && aname != " " && acolor != undefined && acolor != "" && !format.test(aname)) {
                    colorRef.child(acolor).set(null).then(()=>{
                        window.location.href = 'game.html?name=' + aname + '&color=' + acolor + "&room="+ aroom;
                    })

                } else {
                    alert("Enter a valid name and color!");
                }
            }

 
            $scope.setColor = function (acolor) {
                //if scope.color is not null then add it back to colorref
                
                colorRef.child(acolor).set(null).then(()=>{
                    if($scope.color != "" && $scope.color!= undefined){
                        return colorRef.child($scope.color).set(1)
                }
                }).then(()=>{
                $scope.color = acolor
                $scope.colordrop = acolor
                console.log($scope.color)
                console.log($scope.colordrop)
                $scope.$apply()
                })

                //remove acolor from colorref
              
            }


        });