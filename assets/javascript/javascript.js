$(document).ready(function(){
  var config = {
    apiKey: "AIzaSyAaMZAJo1Ua3PC8RAbRV9yFluO0zUrbg18",
    authDomain: "rock-paper-scissors-50d2e.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-50d2e.firebaseio.com",
    storageBucket: "rock-paper-scissors-50d2e.appspot.com",
  };

  firebase.initializeApp(config);
  var database = firebase.database();
  var data = database.ref('data');
  var turn = data.child('turn');
  var name;
  var gameObject = {
		userId: "",
		name: "",
		pick: "",
		wins: 0,
		losses: 0,
		ties: 0,
		name2: "",
		pick2: "",
		wins2: 0,
		losses2: 0,
		ties2: 0,
		turn: 0,
  };

  turn.on('value', function(snapshot){
    console.log('TURN CHANGE: ' + snapshot.val());
    if(snapshot.val() == 1){
      gameObject.turn = 1;
    } else if (snapshot.val() == 2){
      gameObject.turn = 2;
    } else if(snapshot.val() == 3){
      gameObject.turn = 3;
    } else if(snapshot.val() == 0){
      gameObject.turn = 0;
    }
  });

});
