$(document).ready(function(){
  var config = {
    apiKey: "AIzaSyAaMZAJo1Ua3PC8RAbRV9yFluO0zUrbg18",
    authDomain: "rock-paper-scissors-50d2e.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-50d2e.firebaseio.com",
    storageBucket: "rock-paper-scissors-50d2e.appspot.com",
  };

  firebase.initializeApp(config);
  var database = firebase.database();
  var name;
  var connectedRef = firebase.database().ref('.info/connected');
  var playerCount;

  database.ref('users').on('value', function(snapshot){
    playerCount = snapshot.numChildren();
  })

  $('#submit-button').on('click', function(){
    name = $('#name').val().trim();
    playerCount++;
    var myConnectionsRef = firebase.database().ref('users/' + playerCount);
    var connectedRef = firebase.database().ref('.info/connected');
    connectedRef.on('value', function(snap) {
      if (snap.val()) {
        var con = myConnectionsRef.push(true);
        myConnectionsRef.onDisconnect().remove();
      }
    });
    database.ref('users/' + playerCount).update({
      name: name
    });
  });

  $('.choice').on('click', function(){
    var choice = $(this).data('choice');
    database.ref('users/' + playerCount).update({
      choice: choice
    })
  });
});
