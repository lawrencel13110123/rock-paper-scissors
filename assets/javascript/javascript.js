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

  $('#submit-button').on('click', function(){
    name = $('#name').val().trim();
    data.once('value', function(snapshot){
      var player1Exists = snapshot.child('players').child('1').exists();
      var player2Exists = snapshot.child('players').child('2').exists();
      var playersRef = data.child('players');
      var player1Ref = playersRef.child('1');
      var player2Ref = playersRef.child('2');
      if(!player1Exists){
        gameObject.userId = 1;
        console.log('UserId: ' + gameObject.userId);
        player1Ref.set({
          name: name,
          pick: '',
          wins: 0,
          losses: 0,
          ties: 0
        });
        $('#instructions').text('Hi ' + name + '. You are player 1. Waiting for player 2 to arrive.');
        $("#player1").text(name);
        $("#wins1").text('Wins: ' + gameObject.wins);
        $("#losses1").text('Losses: ' + gameObject.losses);
        $("#ties1").text('Ties: ' + gameObject.ties);
      } else if(player1Exists && !player2Exists){
        gameObject.userId = 2;
        console.log('UserId: ' + gameObject.userId);
        player2Ref.set({
          name: name,
          pick: '',
          wins: 0,
          losses: 0,
          ties: 0
        });
        player1Ref.once('value', function(snapshot){
          gameObject.name = snapshot.val().name;
          gameObject.wins = snapshot.val().wins;
          gameObject.losses = snapshot.val().losses;
          gameObject.ties = snapshot.val().ties;
          $('#instructions').text('Hi ' + name + '. You are player 2. Waiting for ' + gameObject.name + ' to make a choice.');
          $("#player2").text(name);
          $("#wins2").text('Wins: ' + gameObject.wins2);
          $("#losses2").text('Losses: ' + gameObject.losses2);
          $("#ties2").text('Ties: ' + gameObject.ties2);
          $("#player1").text(gameObject.name);
          $("#wins1").text('Wins: ' + gameObject.wins);
          $("#losses1").text('Losses: ' + gameObject.losses);
          $("#ties1").text('Ties: ' + gameObject.ties);
        });
      } else{
        alert('Sorry, the game is full. Try again shortly');
      }
    });
    $('#name').val('');
    return false;
  });

});
