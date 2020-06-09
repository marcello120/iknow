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

            
            var basecolors = {
                red: 1,
                green: 1,
                blue: 1,
                orange: 1,
                purple: 1,
                gold: 1
            }


            var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

            $scope.create = function (aroom) {
                if(aroom == "" || aroom == " " || aroom == undefined || format.test(aroom)){
                    alert("Invalid room name");
                    return
                }

                firebase.database().ref().child('rooms').child(aroom).once("value", snapshot => {
                    if (snapshot.exists()) {
                        console.log("exists!");
                        alert("This room exists already, try joining it!");
                    }else{
                        firebase.database().ref().child('rooms').child(aroom).set(firebase.database.ServerValue.TIMESTAMP)
                        .then(()=>{
                            return firebase.database().ref().child(aroom).child('toggle').set(false)
                        })
                        .then(()=>{
                            return firebase.database().ref().child(aroom).child('number').set(1)
                        })
                        .then(()=>{
                            return  firebase.database().ref().child(aroom).child('colors').set(basecolors)
                        })
                        .then(()=>{
                            return window.location.href = 'register.html?room=' + aroom;
                            //transfer to register
                        })
                    }
                });
            }

            $scope.join = function (aroom) {
                if(aroom == "" || aroom == " " || aroom == undefined || format.test(aroom) ){
                    alert("Invalid room number");
                    return
                }

                firebase.database().ref().child(aroom).once("value", snapshot => {
                    if (snapshot.exists()) {

                        //get color


                        window.location.href = 'register.html?room=' + aroom;
                        //go to register
                    }else{
                        console.log("exists!");
                        alert("This room  does not exists, but you can create it!");
                    }
                });
            }


        });