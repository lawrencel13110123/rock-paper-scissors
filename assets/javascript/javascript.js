$(document).ready(function(){
  var config = {
    apiKey: "AIzaSyAaMZAJo1Ua3PC8RAbRV9yFluO0zUrbg18",
    authDomain: "rock-paper-scissors-50d2e.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-50d2e.firebaseio.com",
    storageBucket: "rock-paper-scissors-50d2e.appspot.com",
  };

  $('#submit-button').on('click', function(){
      var name = $('#name').val();
      console.log(name);
       $('#name').val('');
  });


// $('.choice').on('click', function(){
//   if(userChoice1 === ''){
//     userChoice1 = $(this).data('choice');
//     console.log(userName1 + ' chose ' + userChoice1);
//   } else {
//     userChoice2 = $(this).data('choice');
//     console.log(userName2 + ' chose ' + userChoice2);
//   }
//   if(userChoice1 != '' && userChoice2 != ''){
//     checkWinner();
//   }
// });

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
