$(document).ready(function(){
  var config = {
    apiKey: "AIzaSyAaMZAJo1Ua3PC8RAbRV9yFluO0zUrbg18",
    authDomain: "rock-paper-scissors-50d2e.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-50d2e.firebaseio.com",
    storageBucket: "rock-paper-scissors-50d2e.appspot.com",
  };
  firebase.initializeApp(config);
  database = firebase.database();

  $('#submit-button').on('click', function(){
    console.log('hit');
    var name = $('#name').val().trim();
    console.log(name);
    database.ref('players').set({
      name: name
    });
  });
});
