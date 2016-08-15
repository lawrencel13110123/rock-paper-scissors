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
  var name;
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
    name = $('#name').val().trim();
    data.once('value', function(snapshot){
      var player1Exists = snapshot.child('players').child('1').exists();
      var player2Exists = snapshot.child('players').child('2').exists();
      assignPlayer(name, data, player1Exists, player2Exists);
    });
    $('#name').val('');
    return false;
  });


  function assignPlayer(name, data, player1Exists, player2Exists){
    var playersRef = data.child('players');

    if(!player1Exists){
      gameObject.name = name;
      player1Ref = playersRef.child('1');

      player1Ref.set({
        name: name,
        pick: gameObject.pick,
        wins: gameObject.wins,
        losses: gameObject.losses,
        ties: gameObject.ties
      });
      player1Ref.onDisconnect().remove();
      changeDom1();
    } else if(player1Exists && !player2Exists){
      player2Ref = playersRef.child('2');
      gameObject.name2 = name;
      player2Ref.set({
        name: name,
        pick: gameObject.pick2,
        wins: gameObject.wins2,
        losses: gameObject.losses2,
        ties: gameObject.ties2
      });
      player2Ref.onDisconnect().remove();
      changeDom2();
      data.update({
        turn: 1
      });
    } else if(player1Exists && player2Exists){
      alert('The game is full.');
    }
  }

  function changeDom1() {
    gameObject.userId = 1;
    console.log(gameObject.userId)
    data.once("value", function(snapshot) {
      gameObject.userId = 1;
      $("#instructions").text("Hi " + gameObject.name + "! You are player 1. Waiting for a second player.");
      $("#player1").text(gameObject.name);
      $("#wins1").text('Wins: ' + gameObject.wins);
      $("#losses1").text('Losses: ' + gameObject.losses);
      $("#ties1").text('Ties: ' + gameObject.ties);
			});
      checkPlayer2();
		}

    function checkPlayer2() {
			data.on("value", function(snapshot) {
  				var player2Exists = snapshot.child('players').child('2').exists();
  				if (player2Exists && snapshot.val().turn == 1) {
            gameObject.name2 = snapshot.val().players[2].name;
  					$("#player2").text(gameObject.name2);
            $('#instructions').text('You are playing against ' + gameObject.name2 + '. It is your turn. Choose rock, paper, or scissors by clicking on a picture below.');
            $("#wins2").text('Wins: ' + snapshot.val().players[2].wins);
            $("#losses2").text('Losses: ' + snapshot.val().players[2].losses);
            $("#ties2").text('Ties: ' + snapshot.val().players[2].ties);
            $('#choice-section').show();
  				}
			});
		}

    function changeDom2() {
      gameObject.userId = 2;
      console.log(gameObject.userId);
			data.once("value", function(snapshot) {
        gameObject.name = snapshot.val().players[1].name;
        console.log(gameObject.name);
				$('#instructions').text('Welcome ' + gameObject.name2 + '. You are player 2. You will be playing against ' + gameObject.name + '. It is ' + gameObject.name + '\s turn.');
				$("#player1").text(gameObject.name);
        $("#player2").text(gameObject.name2);
        $("#wins2").text('Wins: ' + gameObject.wins2);
        $("#losses2").text('Losses: ' + gameObject.losses2);
        $("#ties2").text('Ties: ' + gameObject.ties2);
        $("#wins1").text('Wins: ' + snapshot.val().players[1].wins);
        $("#losses1").text('Losses: ' + snapshot.val().players[1].losses);
        $("#ties1").text('Ties: ' + snapshot.val().players[1].ties);
			});
		}

    function choice1() {
      var playersRef = data.child('players');
      var player1Ref = playersRef.child('1');
      $('.choice').on('click', function(){
        if(gameObject.turn == 1){
          gameObject.pick = $(this).data('choice');
          player1Ref.update({pick: $(this).data('choice')});
          data.update({turn: 2});
        }
        $('#instructions').text('You chose ' + gameObject.pick + '. Waiting for player 2 to make their choice');
        $('#choice-section').hide();
      });
    }
    function choice2() {
      $('#instructions').text('It is your turn.');
      $('#choice-section').show();
      var playersRef = data.child('players');
      var player2Ref = playersRef.child('2');
      $('.choice').on('click', function(){
        if(gameObject.turn == 2){
          console.log('firebase 2 update');
          player2Ref.update({pick: $(this).data('choice')});
          data.update({turn: 3});
        }
      });
    }
		data.on("value", function(snapshot) {
      if(snapshot.val().turn == 1){
        gameObject.turn = 1;
        choice1();
      }
			if (snapshot.val().turn == 2) {
        gameObject.turn = 2;
				choice2();
			}
			if (snapshot.val().turn == 3) {
        gameObject.turn = 3;
				logic();
			}
		});

  function logic() {
  console.log('Logic Hit');
  data.update({turn: 1});
  data.once('value', function(snapshot){
    gameObject.pick = snapshot.val().players[1].pick;
    gameObject.pick2 = snapshot.val().players[2].pick;
  });
    var p1 = gameObject.pick;
    var p2 = gameObject.pick2;
    var playersRef = data.child('players');
    var player1Ref = playersRef.child('1');
    var player2Ref = playersRef.child('2');
    if (p1 == p2) {
      $('#instructions').text('It\'s a tie!');
      $('#choice1').text(gameObject.name + ' chose ' + p1);
      $('#choice2').text(gameObject.name2 + ' chose ' + p2);
      gameObject.ties++;
      player1Ref.update({
        ties: gameObject.ties
      });
      gameObject.ties2++;
      player2Ref.update({
        ties: gameObject.ties2
      });
    $("#wins1").text('Wins: ' + gameObject.wins);
    $("#losses1").text('Losses: ' + gameObject.losses);
    $("#ties1").text('Ties: ' + gameObject.ties);
    $("#wins2").text('Wins: ' + gameObject.wins2);
    $("#losses2").text('Losses: ' + gameObject.losses2);
    $("#ties2").text('Ties: ' + gameObject.ties2);
  } else if(p1 == 'rock'){
      if(p2 == 'scissors'){
        $('#instructions').text(gameObject.name + ' wins!');
        $('#choice1').text(gameObject.name + ' chose ' + p1);
        $('#choice2').text(gameObject.name2 + ' chose ' + p2);
        gameObject.wins++;
        player1Ref.update({
          wins: gameObject.wins
        });
        gameObject.losses2++;
        player2Ref.update({
          losses: gameObject.losses2
        });
        $("#wins1").text('Wins: ' + gameObject.wins);
        $("#losses1").text('Losses: ' + gameObject.losses);
        $("#ties1").text('Ties: ' + gameObject.ties);
        $("#wins2").text('Wins: ' + gameObject.wins2);
        $("#losses2").text('Losses: ' + gameObject.losses2);
        $("#ties2").text('Ties: ' + gameObject.ties2);
    } else{
      $('#instructions').text(gameObject.name2 + ' wins!');
      $('#choice1').text(gameObject.name + ' chose ' + p1);
      $('#choice2').text(gameObject.name2 + ' chose ' + p2);
      gameObject.losses++;
      player1Ref.update({
        losses: gameObject.losses
      });
      gameObject.wins2++;
      player2Ref.update({
        wins: gameObject.wins2
      });
      $("#wins1").text('Wins: ' + gameObject.wins);
      $("#losses1").text('Losses: ' + gameObject.losses);
      $("#ties1").text('Ties: ' + gameObject.ties);
      $("#wins2").text('Wins: ' + gameObject.wins2);
      $("#losses2").text('Losses: ' + gameObject.losses2);
      $("#ties2").text('Ties: ' + gameObject.ties2);
    }
  } else if(p1 == 'paper'){
    if(p2 == 'rock'){
      $('#instructions').text(gameObject.name + ' wins!');
      $('#choice1').text(gameObject.name + ' chose ' + p1);
      $('#choice2').text(gameObject.name2 + ' chose ' + p2);
      gameObject.wins++;
      player1Ref.update({
        wins: gameObject.wins
      });
      gameObject.losses2++;
      player2Ref.update({
        losses: gameObject.losses2
      });
      $("#wins1").text('Wins: ' + gameObject.wins);
      $("#losses1").text('Losses: ' + gameObject.losses);
      $("#ties1").text('Ties: ' + gameObject.ties);
      $("#wins2").text('Wins: ' + gameObject.wins2);
      $("#losses2").text('Losses: ' + gameObject.losses2);
      $("#ties2").text('Ties: ' + gameObject.ties2);
    } else{
      $('#instructions').text(gameObject.name2 + ' wins!');
      $('#choice1').text(gameObject.name + ' chose ' + p1);
      $('#choice2').text(gameObject.name2 + ' chose ' + p2);
      gameObject.losses++;
      player1Ref.update({
        losses: gameObject.losses
      });
      gameObject.wins2++;
      player2Ref.update({
        wins: gameObject.wins2
      });
      $("#wins1").text('Wins: ' + gameObject.wins);
      $("#losses1").text('Losses: ' + gameObject.losses);
      $("#ties1").text('Ties: ' + gameObject.ties);
      $("#wins2").text('Wins: ' + gameObject.wins2);
      $("#losses2").text('Losses: ' + gameObject.losses2);
      $("#ties2").text('Ties: ' + gameObject.ties2);
    }
  } else if(p1 == 'scissors'){
    if(p2 == 'paper'){
      $('#instructions').text(gameObject.name + ' wins!');
      $('#choice1').text(gameObject.name + ' chose ' + p1);
      $('#choice2').text(gameObject.name2 + ' chose ' + p2);
      gameObject.wins++;
      player1Ref.update({
        wins: gameObject.wins
      });
      gameObject.losses2++;
      player2Ref.update({
        losses: gameObject.losses2
      });
      $("#wins1").text('Wins: ' + gameObject.wins);
      $("#losses1").text('Losses: ' + gameObject.losses);
      $("#ties1").text('Ties: ' + gameObject.ties);
      $("#wins2").text('Wins: ' + gameObject.wins2);
      $("#losses2").text('Losses: ' + gameObject.losses2);
      $("#ties2").text('Ties: ' + gameObject.ties2);
    } else{
      $('#instructions').text(gameObject.name2 + ' wins!');
      $('#choice1').text(gameObject.name + ' chose ' + p1);
      $('#choice2').text(gameObject.name2 + ' chose ' + p2);
      gameObject.losses++;
      player1Ref.update({
        losses: gameObject.losses
      });
      gameObject.wins2++;
      player2Ref.update({
        wins: gameObject.wins2
      });
      $("#wins1").text('Wins: ' + gameObject.wins);
      $("#losses1").text('Losses: ' + gameObject.losses);
      $("#ties1").text('Ties: ' + gameObject.ties);
      $("#wins2").text('Wins: ' + gameObject.wins2);
      $("#losses2").text('Losses: ' + gameObject.losses2);
      $("#ties2").text('Ties: ' + gameObject.ties2);
      }
  }
    resetBoth();
  }

  function resetBoth(){
    data.child('players').child('1').update({pick: ''});
    data.child('players').child('2').update({pick: ''});
    if(gameObject.userId == 1){
      console.log('reset1');
      setTimeout(reset1, 5000);
    } else{
      console.log('reset2');
      setTimeout(reset2, 5000);
    }
  }

  function reset1(){
    $('#instructions').text('It is your turn. Choose rock, paper, or scissors by clicking on a picture below.');
    $('#choice1').text('');
    $('#choice2').text('');
    $('#choice-section').show();
  }

  function reset2(){
    $('#instructions').text('Waiting for ' + gameObject.name + ' to choose.');
    $('#choice1').text('');
    $('#choice2').text('');
    $('#choice-section').hide();
  }

});
