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

  data.onDisconnect().update({turn: 0});

  data.child('players').on('child_removed', function(){
    data.once('value', function(snapshot){
      var player1Exists = snapshot.child('players').child('1').exists();
      var player2Exists = snapshot.child('players').child('2').exists();
      if(player1Exists && !player2Exists){
        $('#instructions').text('Oops. It looks like player 2 has left the game. Waiting for a new player to join.');
        $('#choice1').text('');
        $('#choice2').text('');
        $('#player2').text('');
        $('#wins2').text('');
        $('#losses2').text('');
        $('#ties2').text('');
        $('#choice-section').hide();
      } else if (player2Exists && !player1Exists){
        $('#instructions').text('Oops. It looks like player 1 has left the game. Waiting for a new player to join.');
        $('#choice1').text('');
        $('#choice2').text('');
        $('#player1').text('');
        $('#wins1').text('');
        $('#losses1').text('');
        $('#ties1').text('');
        $('#choice-section').hide();
      } else{
        return;
      }
    });
    data.child('players').on('child_added', function(){
      data.once('value', function(snapshot){
        var player1Exists = snapshot.child('players').child('1').exists();
        if(player1Exists && gameObject.userId == '2'){
          var player1Ref = data.child('players').child('1');
          player1Ref.once('value', function(snapshot){
            gameObject.name = snapshot.val().name;
            gameObject.wins = snapshot.val().wins;
            gameObject.losses = snapshot.val().losses;
            gameObject.ties = snapshot.val().ties;
            $('#instructions').text(gameObject.name + ' has joined the game. Waiting for their choice.');
            $("#player2").text(name);
            $("#wins2").text('Wins: ' + gameObject.wins2);
            $("#losses2").text('Losses: ' + gameObject.losses2);
            $("#ties2").text('Ties: ' + gameObject.ties2);
            $("#player1").text(gameObject.name);
            $("#wins1").text('Wins: ' + gameObject.wins);
            $("#losses1").text('Losses: ' + gameObject.losses);
            $("#ties1").text('Ties: ' + gameObject.ties);
          });
        }
      });
    });

  });

  turn.on('value', function(snapshot){
    console.log('TURN CHANGE: ' + snapshot.val());
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
        data.once("value", function(snapshot) {
            var player2Exists = snapshot.child('players').child('2').exists();
            if (player2Exists) {
              gameObject.name2 = snapshot.val().players[2].name;
              $("#player2").text(gameObject.name2);
              $('#choice1').text('');
              $('#choice2').text('');
              $('#instructions').text('It is your turn. Choose rock, paper, or scissors by clicking on a picture below.');
              $("#wins2").text('Wins: ' + snapshot.val().players[2].wins);
              $("#losses2").text('Losses: ' + snapshot.val().players[2].losses);
              $("#ties2").text('Ties: ' + snapshot.val().players[2].ties);
              $('#choice-section').show();
              data.update({turn: 1});
            }
        });
        player1Ref.onDisconnect().remove();
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
          player2Ref.onDisconnect().remove();
        });
        data.update({turn: 1});
      } else{
        alert('Sorry, the game is full. Try again shortly');
      }
    });
    $('#name').val('');
    return false;
  });
  function user1Choose(){
    if(gameObject.userId == '1' && gameObject.turn == 1){
      data.once("value", function(snapshot) {
          var player2Exists = snapshot.child('players').child('2').exists();
          if (player2Exists) {
            gameObject.name2 = snapshot.val().players[2].name;
            $("#player2").text(gameObject.name2);
            $('#choice1').text('');
            $('#choice2').text('');
            $('#instructions').text('It is your turn. Choose rock, paper, or scissors by clicking on a picture below.');
            $("#wins2").text('Wins: ' + snapshot.val().players[2].wins);
            $("#losses2").text('Losses: ' + snapshot.val().players[2].losses);
            $("#ties2").text('Ties: ' + snapshot.val().players[2].ties);
            $('#choice-section').show();
          }
      });
      var playersRef = data.child('players');
      var player1Ref = playersRef.child('1');
      $('.choice').on('click', function(){
        gameObject.pick = $(this).data('choice');
        player1Ref.update({pick: $(this).data('choice')});
        data.update({turn: 2});
        $('#instructions').text('You chose ' + gameObject.pick + '. Waiting for player 2 to make their choice.');
        $('#choice-section').hide();
      });
    }
  }

  function user2Choose(){
    if(gameObject.userId == '2' && gameObject.turn == 2){
      console.log('user 2 choose function hit.');
      var playersRef = data.child('players');
      var player2Ref = playersRef.child('2');
      $('#instructions').text('It is your turn.');
      $('#choice-section').show();
      $('.choice').on('click', function(){
        gameObject.pick = $(this).data('choice');
        player2Ref.update({pick: $(this).data('choice')});
        data.update({turn: 3});
        $('#choice-section').hide();
      });
    }
  }

  function checkWinner(){
    if(gameObject.turn == 3){
      if(gameObject.userId == '1'){
        data.update({turn: 0});
      }
      data.once('value', function(snapshot){
        var player1Ref = data.child('players').child('1');
        var player2Ref = data.child('players').child('2');
        var p1 = snapshot.val().players[1].pick;
        var p2 = snapshot.val().players[2].pick;
        gameObject.name = snapshot.val().players[1].name;
        gameObject.name2 = snapshot.val().players[2].name;
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
        $('#choice1').text(snapshot.val().players[1].name + ' chose ' + p1 + '.');
        $('#choice2').text(snapshot.val().players[2].name + ' chose ' + p2 + '.');
        $("#wins1").text('Wins: ' + gameObject.wins);
        $("#losses1").text('Losses: ' + gameObject.losses);
        $("#ties1").text('Ties: ' + gameObject.ties);
        $("#wins2").text('Wins: ' + gameObject.wins2);
        $("#losses2").text('Losses: ' + gameObject.losses2);
        $("#ties2").text('Ties: ' + gameObject.ties2);
      });
    }
    setTimeout(reset, 5000);
  }

  function reset(){
    data.update({turn: 1});
    if(gameObject.userId == '2'){
      $('#choice1').text('');
      $('#choice2').text('');
      $('#instructions').text('Waiting for ' + gameObject.name + ' to make a choice.');
    }
  }
});
