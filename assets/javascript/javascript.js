$(document).ready(function(){
  var userName1;
  var userName2;
  var userChoice1;
  var userChoice2;
});

function checkWinner(){
  if(userChoice1 === userChoice2){
    alert('It\'s a tie!');
  } else if(userChoice1 === 'rock'){
      if(userChoice2 === 'paper'){
        alert(userName2 + 'wins!');
      } else{
        alert(userName1 + 'wins!');
      }
  } else if(userChoice1 === 'paper'){
      if(userChoice2 === 'rock'){
        alert(userName1 + 'wins!');
      } else{
        alert(userName2 + 'wins!');
      }
  } else{
      if(userChoice2 === 'rock'){
        alert(userName2 + 'wins!');
      } else{
        alert(userName1 + 'wins!');
      }
  }
}
