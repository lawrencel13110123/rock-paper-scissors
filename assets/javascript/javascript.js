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
  var gameObject = {
    time: "",
		myName: "",
		message: "",
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


  $('#submit-button').on('click', function(){
    data.update({
      turn: gameObject.turn
    });
    gameObject.name = $('#name').val().trim();
    data.once('value', function(snapshot){
      var player1Exists = snapshot.child('players').child('1').exists();
      var player2Exists = snapshot.child('players').child('2').exists();
      assignPlayer(gameObject.name, data, player1Exists, player2Exists);
    });
    $('#name').val('');
    return false;
  });


  function assignPlayer(name, data, player1Exists, player2Exists){
    var playersRef = data.child('players');

    if(!player1Exists){

      player1Ref = playersRef.child('1');

      player1Ref.set({
        name: gameObject.name,
        pick: gameObject.pick,
        wins: gameObject.wins,
        losses: gameObject.losses,
        ties: gameObject.ties
      });
      player1Ref.onDisconnect().remove();
    } else if(player1Exists && !player2Exists){
      player2Ref = playersRef.child('2');
      player2Ref.set({
        name: gameObject.name,
        pick: gameObject.pick,
        wins: gameObject.wins,
        losses: gameObject.losses,
        ties: gameObject.ties
      });
      player2Ref.onDisconnect().remove();
      // player2Ref.onDisconnect().resetTurn();
    } else if(player1Exists && player2Exists){
      alert('The game is full.');
    }
  }
});
