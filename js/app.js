/**
* Parent class GameEntity
* @constructor
*/
var GameEntity = function() {

};
/**
* Gets the x block of the grid based on the x position
* @param {int} x - The x position in the canvas
*/
GameEntity.prototype.getXBlock = function(x) {
 return Math.floor(x / 101);
};
/**
* Gets the y block of the grid based on the y position
* @param {int} y - The y position in the canvas
*/
GameEntity.prototype.getYBlock = function(y) {
 return Math.floor(y / 83);
};
/**
* Given the game blocks set the x and y position on the canvas
* @param {int} x - The x block in the game
* @param {int} y - The y block in the game
*/
GameEntity.prototype.setPositionFromXYBlock = function(x, y) {
 this.x = x * 101;
 this.y = y * 83;
};

/**
* End GameEntity class
*/
/**
* Enemy class
* @constructor
* @extends GameEntity
*/
var Enemy = function() {
 this.sprite = 'images/enemy-bug.png';
 this.width = 101;
 this.height = 83;
 this.setLocationAndSpeed();
};
// Setting up the inheritance for Enemy
Enemy.prototype = Object.create(GameEntity.prototype);
Enemy.constructor = Enemy;

/**
* Update the enemy's position
* @param dt - a time delta between ticks
*/
Enemy.prototype.update = function(dt) {

 this.x = (this.x + this.speed * dt);
 //after the bug goes off the screen reset its position
 if (this.x > ctx.canvas.width) {
  this.setLocationAndSpeed();
 }
 if (this.collide(player)) {
  player.lose();
 }
};
/* Draw the enemy on the screen*/
Enemy.prototype.render = function() {
 //20 offset is to pull the bug up into the block
 ctx.drawImage(Resources.get(this.sprite), this.x, this.y - 20);
};
/**
* Check if the enemy has collided with the player
* @param {Player} player - the player in the game
*/
Enemy.prototype.collide = function(player) {

 var xBetween = false;
 var yBetween = false;
 //enemy start x between players x boundaries
 if (this.x > player.x && this.x < player.x + player.width) {
  xBetween = true;
 }
 //player start x between enemies boundaries
 //50 offset is for head of bug to cross player
 if (player.x > this.x - 50 && player.x < this.x + this.width - 50) {
  xBetween = true;
 }
 if (player.x == this.x) {
  xBetween = true;
 }
 //enemy start y between players y boundaries
 if (this.y > player.y && this.y < (player.y + player.height)) {
  yBetween = true;
 }
 //player start y between enemy boundaries
 if (player.y > this.y && player.y < (this.y + this.height)) {
  yBetween = true;
 }
 if (this.y == player.y) {
  yBetween = true;
 }
 if (xBetween && yBetween) {
  return true;
 } else {
  return false;
 }
};
/**
* Set the start location and speed of the enemy
*/
Enemy.prototype.setLocationAndSpeed = function() {
 var randomNum = Math.random();
 var whichStoneRow = Math.floor(randomNum * (3)) + 1;
 this.setPositionFromXYBlock(0, whichStoneRow);

 //subtract from the x position to create a delay before entering
 var delay = (Math.floor(randomNum * 5) + 1) * 100;
 this.x = this.x - delay;

 //slow
 if (randomNum < 0.1) {
  this.speed = 200;
 }
 //fast
 else if (randomNum > 0.8) {
  this.speed = 500;
 }
 //average
 else {
  this.speed = 300;
 }
};
/**
* End Enemy class
*/

/**
* Player class
* @constructor
* @extends GameEntity
*/
var Player = function() {
 this.sprite = 'images/char-boy.png';
 this.setPositionFromXYBlock(2, 5);
 this.width = 101;
 this.height = 83;
 this.wins = 0;
 this.losses = 0;
};
//set up the inheritance for the Player class
Player.prototype = Object.create(GameEntity.prototype);
Player.constructor = Player;

/* Updates the player's position */
Player.prototype.update = function(newX, newY) {
 //update x if the players horizontal move is
 //within the left and right bounds of the canvas
 if (newX >= 0 && this.getXBlock(newX) >= 0 && this.getXBlock(newX) < 5) {
  this.x = newX;
 }
 //update y if the players vertical movement
 //is above the grass and below the water
 if (newY >= 0 && this.getYBlock(newY) > 0 && this.getYBlock(newY) < 6) {
  this.y = newY;
 }
};

/* Draws the player on the screen */
Player.prototype.render = function() {
 //40 offset is to center the player in the block
 ctx.drawImage(Resources.get(this.sprite), this.x, this.y - 40);
};
/* Changes the player's position to the start position */
Player.prototype.resetPosition = function() {
 this.setPositionFromXYBlock(2, 5);
};

/**
* Compute the player's new position based on the player input
* @param {string} input - The direction of the key pressed
*/
Player.prototype.handleInput = function(input) {
 var newX;
 var newY;
 if (input == 'up') {
  newY = this.y - 83;
 }
 if (input == 'down') {
  newY = this.y + 83;
 }
 if (input == 'left') {
  newX = this.x - 101;
 }
 if (input == 'right') {
  newX = this.x + 101;
 }
 this.update(newX, newY);
 //if the player moves into the water the player has won
 if (this.getYBlock(newY) === 0) { //reset
  this.win();
 }
};
/**
* Update the player's score and reset the position
*/
Player.prototype.win = function() {
 this.wins++;
 document.getElementById("wins").innerHTML = this.wins;
 this.resetPosition();
};
/**
* Update the player's score and reset the position
*/
Player.prototype.lose = function() {
 //reset the player
 this.losses++;
 document.getElementById("losses").innerHTML = this.losses;
 this.resetPosition();
};
/**
* End Player class
*/


/** Setup player and enemies */
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];

/** Place the player object in a variable called player */
var player = new Player();

/**
* Key listener
*/
document.addEventListener('keyup', function(e) {
 var allowedKeys = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
 };

 player.handleInput(allowedKeys[e.keyCode]);
});
//stops the arrows from scrolling the window while playing the game
document.addEventListener("keydown",
 function(e) {
  switch (e.keyCode) {
   case 37:
   case 39:
   case 38:
   case 40: // Arrow keys
   case 32:
    e.preventDefault();
    break; // Space
   default:
    break; // do not block other keys
  }
 });
