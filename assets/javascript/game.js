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
  //removes player 1 and player 2 from the database on disconnect//
  player1Ref.onDisconnect().remove();
  player2Ref.onDisconnect().remove();
  //keeps global variables in sync with firebase on changes to firebase//
  data.on('value', function(snapshot){
  //sets player1Exists and player2Exists to true or false depending on if they exist in the database//
  player1Exists = snapshot.child('players').child('1').exists();
  player2Exists = snapshot.child('players').child('2').exists();
  });
  //keeps the gameObject.turn variable in sync with firebase//
  turn.on('value', function(snapshot){
    if(snapshot.val() == 1){
      gameObject.turn = 1;
      user1Choose();
    } else if (snapshot.val() == 2){
      gameObject.turn = 2;
      user2Choose();
    } else if(snapshot.val() == 3){
      gameObject.turn = 3;
      checkWinner();
    } else if(snapshot.val() == 0){
      gameObject.turn = 0;
    }
  });

  //on click function for when a user submits name//
  $('#submit-button').on('click', function(){
    name = $('#name').val();
    assignPlayer(name);
    $('#name').val('');
  });


  //function to assign player to player 1 or player 2//
  function assignPlayer(){
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
      //set the turn to 1 so player 1 can pick//
      data.update({turn: 1});
    } else{
      alert('Sorry the game is full. Try again shortly.');
    }
  }
  //function for player 1 to choose rock, paper, or scissors//
  function user1Choose(){
    //double check this will only work for player 1 and it is player 1 turn//
    if(gameObject.userId == '1' && gameObject.turn == 1){
      //get player 2 info from firebase//
      player2Ref.once("value", function(snapshot) {
        gameObject.name2 = snapshot.val().name;
        $("#player2").text(gameObject.name2);
        // $('#choice1').text('');
        // $('#choice2').text('');
        $('#instructions').text('It is your turn. Choose rock, paper, or scissors by clicking on a picture below.');
        $('#chat-window').empty();
        $('#chat-window').append('<p class="text-center">You are playing against ' + gameObject.name2 + '. You can chat here.</p>');
        $("#wins2").text('Wins: ' + snapshot.val().wins);
        $("#losses2").text('Losses: ' + snapshot.val().losses);
        $("#ties2").text('Ties: ' + snapshot.val().ties);
        $('#choice-section').show();
      });
      //on click function to set player 1 choice and update firebase with user choice//
      $('.choice').on('click', function(){
        gameObject.pick = $(this).data('choice');
        player1Ref.update({pick: gameObject.pick});
        //update to turn 2 for player 2 to choose//
        data.update({turn: 2});
        //change DOM for player 1//
        $('#instructions').text('You chose ' + gameObject.pick + '. Waiting for player 2 to make their choice.');
        $('#choice-section').hide();
      });
    }
  }

  function user2Choose(){
    //double check this will only work for player 2 and it is player 2 turn//
    if(gameObject.userId == '2' && gameObject.turn == 2){
      //change DOM for player 2//
      $('#instructions').text('It is your turn.');
      $('#choice-section').show();
      //on click function to set player 1 choice and update firebase with user choice//
      $('.choice').on('click', function(){
        gameObject.pick2 = $(this).data('choice');
        player2Ref.update({pick: gameObject.pick2});
        //change the turn to 3 to trigger the logic function//
        data.update({turn: 3});
        $('#choice-section').hide();
      });
    }
  }

  function checkWinner(){
    console.log('check winner hit');
    //ensure it is turn 3//
    if(gameObject.turn == 3){
      // player 2 changes the turn to 0 so the function only runs once//
      // Only user 1 does this because if both users do it would mess up the order//
      if(gameObject.userId == '1'){
        data.update({turn: 0});
      }
      playersRef.once('value', function(snapshot){
        var p1 = snapshot.child('1').val().pick;
        var p2 = snapshot.child('2').val().pick;
        if (p1 == p2) {
          $('#instructions').text('It\'s a tie!');
          gameObject.ties++;
          player1Ref.update({
            ties: gameObject.ties
          });
          gameObject.ties2++;
          player2Ref.update({
            ties: gameObject.ties2
          });
        } else if(p1 == 'rock'){
            if(p2 == 'scissors'){
              $('#instructions').text(gameObject.name + ' wins!');
              gameObject.wins++;
              player1Ref.update({
                wins: gameObject.wins
              });
              gameObject.losses2++;
              player2Ref.update({
                losses: gameObject.losses2
              });
          } else{
            $('#instructions').text(gameObject.name2 + ' wins!');
            gameObject.losses++;
            player1Ref.update({
              losses: gameObject.losses
            });
            gameObject.wins2++;
            player2Ref.update({
              wins: gameObject.wins2
            });
          }
        } else if(p1 == 'paper'){
          if(p2 == 'rock'){
            $('#instructions').text(gameObject.name + ' wins!');
            gameObject.wins++;
            player1Ref.update({
              wins: gameObject.wins
            });
            gameObject.losses2++;
            player2Ref.update({
              losses: gameObject.losses2
            });
          } else{
            $('#instructions').text(gameObject.name2 + ' wins!');
            gameObject.losses++;
            player1Ref.update({
              losses: gameObject.losses
            });
            gameObject.wins2++;
            player2Ref.update({
              wins: gameObject.wins2
            });
          }
        } else if(p1 == 'scissors'){
          if(p2 == 'paper'){
            $('#instructions').text(gameObject.name + ' wins!');
            gameObject.wins++;
            player1Ref.update({
              wins: gameObject.wins
            });
            gameObject.losses2++;
            player2Ref.update({
              losses: gameObject.losses2
            });
          } else{
            $('#instructions').text(gameObject.name2 + ' wins!');
            gameObject.losses++;
            player1Ref.update({
              losses: gameObject.losses
            });
            gameObject.wins2++;
            player2Ref.update({
              wins: gameObject.wins2
            });
            }
        }
        //changes the DOM for both players//
        $('#choice1').text(gameObject.name + ' chose ' + p1 + '.');
        $('#choice2').text(gameObject.name2 + ' chose ' + p2 + '.');
        $("#wins1").text('Wins: ' + gameObject.wins);
        $("#losses1").text('Losses: ' + gameObject.losses);
        $("#ties1").text('Ties: ' + gameObject.ties);
        $("#wins2").text('Wins: ' + gameObject.wins2);
        $("#losses2").text('Losses: ' + gameObject.losses2);
        $("#ties2").text('Ties: ' + gameObject.ties2);
      });
    }
    //show the results for 3 seconds and then run the reset function//
    setTimeout(reset, 3000);
  }
  //reset function to change the DOM and change the turn to 1 so player 1 is prompted to choose again//
  function reset(){
    data.update({turn: 1});
    //changes the DOM for BOTH players//
    $('#choice1').text('');
    $('#choice2').text('');
    //changes the DOM for player 2, player 1's DOM is changed by the user1Choose function which is called since the turn is set back to 1//
    if(gameObject.userId == '2'){
      $('#choice1').text('');
      $('#choice2').text('');
      $('#instructions').text('Waiting for ' + gameObject.name + ' to make a choice.');
    }
    //ensures the neither player disconnects during the timeout, if one does the turn is set to 0 until a new player is added so that the user1Choose function is NOT called//
    data.once('value', function(snapshot){
      if(snapshot.numChildren != 2){
        data.update({turn: 0});
      }
    });
  }

    //on click for the chat submit button that runs sendChat function//
    $('#submit-button').on('click', function(){
      var chat = $('#chat').val();
      sendChat(chat);
      $('#chat').val('');
    })

    //function to send chat to firebase, only works if two users are present//
    function sendChat(chat){
      if(player1Exists && player2Exists){
        if(gameObject.userId == '1'){
          data.child('chat').push({message: gameObject.name + ': ' + chat});
        } else if(gameObject.userId == '2'){
          data.child('chat').push({message: gameObject.name2 + ': ' + chat});
        }
      } else{
        return;
      }
    }

});
