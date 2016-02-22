//************************************
//
// Parent class GameEntity
//
//************************************
var GameEntity = function(){

};
GameEntity.prototype.getXBlock = function(x){
  return Math.floor(x/101);
}
GameEntity.prototype.getYBlock = function(y){
  return Math.floor(y/83);
}
GameEntity.prototype.setPositionFromXYBlock = function(x,y){
    this.x = x*101;
    this.y = y*83;
}

//************************************
//
// End GameEntity class
//
//************************************
//************************************
//
// Enemy class
//
//************************************
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.width = 101;
    this.height = 83;
    this.setLocationAndSpeed();
};
Enemy.prototype = Object.create(GameEntity.prototype);
Enemy.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = (this.x + this.speed * dt);
    //after the bug goes off the screen reset its position
    if(this.x > ctx.canvas.width){
      this.setLocationAndSpeed();
    }
    if(this.collide(player)){
      player.lose();
    }
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  //20 offset is to pull the bug up into the block
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y-20);
};
//Check if the enemy has collided with the player
Enemy.prototype.collide = function(player){

  var xBetween = false;
  var yBetween = false;
  //enemy start x between players x boundaries
  if(this.x > player.x && this.x < player.x+player.width){
    xBetween = true;
  }
  //player start x between enemies boundaries
  //50 offset is for head of bug to cross player
  if(player.x > this.x -50 && player.x < this.x+this.width-50){
    xBetween = true;
  }
  if(player.x == this.x){
    xBetween = true;
  }
  //enemy start y between players y boundaries
  if(this.y > player.y && this.y < (player.y+player.height)){
    yBetween = true;
  }
  //player start y between enemy boundaries
  if(player.y > this.y && player.y < (this.y + this.height)){
    yBetween = true;
  }
  if(this.y == player.y){
    yBetween = true;
  }
  if(xBetween && yBetween){
    return true;
  }else{
    return false;
  }
}
//set the start location and speed
Enemy.prototype.setLocationAndSpeed = function(){
  var randomNum = Math.random();
  var whichStoneRow = Math.floor(randomNum*(3))+1;
  this.setPositionFromXYBlock(0,whichStoneRow);

  //subtract from the x position to create a delay before entering
  delay = (Math.floor(randomNum * 5) + 1)*100;
  this.x = this.x- delay;

  //slow
  if(randomNum < 0.1){
    this.speed = 200;
  }
  //fast
  else if(randomNum > 0.7){
    this.speed = 500;
  }
  //average
  else{
    this.speed = 300;
  }
}
//************************************
//
// End Enemy class
//
//************************************

//************************************
//
// Player class
//
//************************************
var Player = function(){
  this.sprite = 'images/char-boy.png';
  this.setPositionFromXYBlock(2,5);
  this.width = 101;
  this.height = 83;
  this.wins = 0;
  this.losses = 0;
};
Player.prototype = Object.create(GameEntity.prototype);
Player.constructor = Player;
// This class requires an update(), render() and
// a handleInput() method.
Player.prototype.update = function(){

};

Player.prototype.render = function(){
  //40 offset is to center the player in the block
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y-40);
};
Player.prototype.resetPosition = function(){
  this.setPositionFromXYBlock(2,5);
}
Player.prototype.handleInput = function(input){
  var newX;
  var newY;
  if(input == 'up'){
    newY = this.y - 83;
  }
  if(input == 'down'){
    newY = this.y + 83;
  }
  if(input == 'left'){
    newX = this.x - 101;
  }
  if(input == 'right'){
    newX = this.x + 101;
  }
  //update x if the players horizontal move is within the left and right bounds
  //of the canvas
  if(newX >= 0 && this.getXBlock(newX) >=0 && this.getXBlock(newX)<5){
    this.x = newX;
  }
  //update y if the players vertical movement is above the grass and below
  //the water
  if(newY >= 0 && this.getYBlock(newY) >0 && this.getYBlock(newY)<6){
    this.y = newY;
  }
  //if the player moves into the water the player has won
  if(this.getYBlock(newY) == 0){//reset
    this.win();
  }
};
Player.prototype.win = function(){
  this.wins++;
  document.getElementById("wins").innerHTML = this.wins;
  this.resetPosition();
}
Player.prototype.lose = function(){
  //reset the player
  this.losses++;
  document.getElementById("losses").innerHTML = this.losses;
  this.resetPosition();
}
//************************************
//
// End Player class
//
//************************************

//************************************
//
// Setup player and enemies
//
//************************************
var allEnemies = [ new Enemy(), new Enemy(), new Enemy()];

// Place the player object in a variable called player
var player = new Player();

//setup the enemies
//for(var i=0;i<allEnemies.length;i++){
//  allEnemies[i].setLocationAndSpeed();
//}

//************************************
//
// Key listener
//
//************************************
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
document.addEventListener("keydown",
    function(e){
        switch(e.keyCode){
            case 37: case 39: case 38:  case 40: // Arrow keys
            case 32: e.preventDefault(); break; // Space
            default: break; // do not block other keys
        }
    });
