$(document).ready(function(){
  //firebase config and initialization//
  var config = {
    apiKey: "AIzaSyAaMZAJo1Ua3PC8RAbRV9yFluO0zUrbg18",
    authDomain: "rock-paper-scissors-50d2e.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-50d2e.firebaseio.com",
    storageBucket: "rock-paper-scissors-50d2e.appspot.com",
  };
  firebase.initializeApp(config);
  //firebase references//
  var database = firebase.database();
  var data = database.ref('data');
  var turn = data.child('turn');
  var playersRef = data.child('players');
  var player1Ref = playersRef.child('1');
  var player2Ref = playersRef.child('2');
  //global variables//
  var player1Exists;
  var player2Exists;
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
  //sets the turn to 0 if a player disconnects//
  data.onDisconnect().update({turn: 0});
  //resets the chat if a player disconnects//
  data.child('chat').onDisconnect().set({});
  //keeps global variables in sync with firebase on changes to firebase//
  data.on('value', function(snapshot){
  //removes player 1 and player 2 from the database on disconnect//
  player1Ref.onDisconnect().remove();
  player2Ref.onDisconnect().remove();
  //sets player1Exists and player2Exists to true or false depending on if they exist in the database//
  player1Exists = snapshot.child('players').child('1').exists();
  player2Exists = snapshot.child('players').child('2').exists();
  //keeps the gameObject.turn variable in sync with firebase//
  if(snapshot.val().turn == 1){
    gameObject.turn = 1;
    user1Choose();
  } else if (snapshot.val().turn == 2){
    gameObject.turn = 2;
    user2Choose();
  } else if(snapshot.val().turn == 3){
    gameObject.turn = 3;
    checkWinner();
  } else if(snapshot.val().turn == 0){
    gameObject.turn = 0;
  }
  });
  //function to assign player to player 1 or player 2//
  function assignPlayer(name){
    //if player 1 does NOT exist assign as player 1 and set player 1 as new firebase object//
    if(!player1Exists){
      gameObject.userId = 1;
      gameObject.name = name;
      player1Ref.set({
        name: name,
        pick: '',
        wins: 0,
        losses: 0,
        ties: 0
      });
      //change the DOM for player 1//
      $('#instructions').text('Hi ' + name + '. You are player 1. Waiting for player 2 to arrive.');
      $('#chat-window').append('<p class="text-center">You can chat with your opponent here when they join the game.</p>');
      $("#player1").text(name);
      $("#wins1").text('Wins: ' + gameObject.wins);
      $("#losses1").text('Losses: ' + gameObject.losses);
      $("#ties1").text('Ties: ' + gameObject.ties);
      //check to see if player 2 exists in the database in case there is already a player 2 waiting for a new player 1, if player 2 does exist set the turn to 1//
      playersRef.once("value", function(snapshot) {
          if (player2Exists) {
            data.update({turn: 1});
          }
      });
      //if player 1 exists but player 2 does NOT exist, assign the player as player 2 and set player 2 as a new firebase object//
    } else if (player1Exists && !player2Exists){
      gameObject.userId = 2;
      gameObject.name2 = name;
      player2Ref.set({
        name: name,
        pick: '',
        wins: 0,
        losses: 0,
        ties: 0
      });
      //get player 1 info from firebase and set it in gameObject//
      player1Ref.once('value', function(snapshot){
        gameObject.name = snapshot.val().name;
        gameObject.wins = snapshot.val().wins;
        gameObject.losses = snapshot.val().losses;
        gameObject.ties = snapshot.val().ties;
        //change the DOM for player 2//
        $('#instructions').text('Hi ' + name + '. You are player 2. Waiting for ' + gameObject.name + ' to make a choice.');
        $('#chat-window').append('<p class="text-center">You are playing against ' + gameObject.name + '. You can chat here.</p>');
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
      alert('Sorry the game is full. Try again shortly.');
    }
  }

});
