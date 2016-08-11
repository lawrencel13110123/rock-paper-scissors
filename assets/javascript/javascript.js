$(document).ready(function(){
  var config = {
    apiKey: "AIzaSyAaMZAJo1Ua3PC8RAbRV9yFluO0zUrbg18",
    authDomain: "rock-paper-scissors-50d2e.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-50d2e.firebaseio.com",
    storageBucket: "rock-paper-scissors-50d2e.appspot.com",
  };
  playerNumber = 1;
  firebase.initializeApp(config);
  var database = firebase.database();
  var connectedRef = database.ref(".info/connected");
  var connectionsRef = database.ref("/players");

$('#submit-button').on('click', function(){
  var name = $('#name').val().trim();
  connectionsRef.push(true);
});

// When the client's connection state changes...
connectedRef.on("value", function(snap) {
	// If they are connected..
	if( snap.val() ) {
		// Remove user from the connection list when they disconnect.
		connectionsRef.onDisconnect().remove();
	};

});


});
