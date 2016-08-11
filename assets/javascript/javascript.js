$(document).ready(function(){
  var config = {
    apiKey: "AIzaSyAaMZAJo1Ua3PC8RAbRV9yFluO0zUrbg18",
    authDomain: "rock-paper-scissors-50d2e.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-50d2e.firebaseio.com",
    storageBucket: "rock-paper-scissors-50d2e.appspot.com",
  };
  var playercount;
  firebase.initializeApp(config);
  database = firebase.database();

  // connectionsRef references a secific location in our database.
  // All of our connections will be stored in this directory.
  var connectionsRef = database.ref("/connections");

  // '.info/connected' is a special location provided by Firebase that is updated every time the client's connection state changes.
  // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
  var connectedRef = database.ref(".info/connected");

  // When the client's connection state changes...
  connectedRef.on("value", function(snap) {

  	// If they are connected..
  	if( snap.val() ) {

  		// Add user to the connections list.
  		var con = connectionsRef.push(true);
      console.log(connectionsRef);
  		// Remove user from the connection list when they disconnect.
  		con.onDisconnect().remove();

  	};

  });


});
