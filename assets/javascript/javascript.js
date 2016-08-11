$(document).ready(function(){
  var config = {
    apiKey: "AIzaSyAaMZAJo1Ua3PC8RAbRV9yFluO0zUrbg18",
    authDomain: "rock-paper-scissors-50d2e.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-50d2e.firebaseio.com",
    storageBucket: "rock-paper-scissors-50d2e.appspot.com",
  };
  var playerKey;
  var userChoice1;
  var userChoice2;
  firebase.initializeApp(config);
  database = firebase.database();

  // connectionsRef references a secific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/players");

// '.info/connected' is a special location provided by Firebase that is updated every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

	// If they are connected..
	if( snap.val() ) {

		// Add user to the connections list.
		var con = connectionsRef.push(true);
    playerKey = con.key;
    console.log(playerKey);
		// Remove user from the connection list when they disconnect.
		con.onDisconnect().remove();

	};

});

  $('#submit-button').on('click', function(){
      var name = $('#name').val();
      console.log(name);
      database.ref('players/' + playerKey).set({
        name: name,
        choice: ''
      });
  });

  // database.ref('/players').on("value", function(snapshot) {
  //   snapshot.forEach(function(childSnapshot) {
  //
  //   });
  // });


$('.choice').on('click', function(){
  var choice = $(this).data('choice');
  database.ref('players/' + playerKey).update({
    choice: choice
  });
});

function checkWinner(){
  if(userChoice1 === userChoice2){
    alert('It\'s a tie!');
  } else if(userChoice1 === 'rock'){
      if(userChoice2 === 'paper'){
        alert(userName2 + ' wins!');
      } else{
        alert(userName1 + ' wins!');
      }
  } else if(userChoice1 === 'paper'){
      if(userChoice2 === 'rock'){
        alert(userName1 + ' wins!');
      } else{
        alert(userName2 + ' wins!');
      }
  } else{
      if(userChoice2 === 'rock'){
        alert(userName2 + ' wins!');
      } else{
        alert(userName1 + ' wins!');
      }
  }
  reset();
}

function reset(){
  userChoice1 = '';
  userChoice2 = '';
}

});
