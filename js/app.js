// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = 0;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = (this.x + this.speed * dt);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y-20);
};

// Now write your own player class
var Player = function(){
  this.sprite = 'images/char-boy.png';
  setPositionFromXYBlock(this,2,5);
};
// This class requires an update(), render() and
// a handleInput() method.
Player.prototype.update = function(){

};

Player.prototype.render = function(){

  ctx.drawImage(Resources.get(this.sprite), this.x, this.y-40);
};

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
  if(newX >= 0 && getXBlock(newX) >=0 && getXBlock(newX)<5){
    this.x = newX;
  }if(newY >= 0 && getYBlock(newY) >0 && getYBlock(newY)<6){
    this.y = newY;
  }
  if(getYBlock(newY) == 0){//reset
    setPositionFromXYBlock(this,2,5);
  }
  //this.update();
};
function getXBlock(x){
  return Math.floor(x/101);
}
function getYBlock(y){
  return Math.floor(y/83);
}
function getBlock(entity){
  var xBlock = getXBlock(entity.x);
  var yBlock = getYBlock(entity.y);

  return block = yBlock * 5 + xBlock;
}
function blockIsOccupied(block,enemies){
  for(var i = 0; i < enemies.length;i++){
    if(block == getBlock(enemies[i]));
  }
}
function setPositionFromXYBlock(entity,x,y){
    entity.x = x*101;
    entity.y = y*83;
}
function setPositionFromBlock(entity,block){
  var heightOfRow = 83;
  var waterHeight = heightOfRow;
  entity.x = (block % 5) * 101;
  entity.y = Math.floor(block / 5) * heightOfRow + waterHeight;
}
function initializeAllEnemies(enemies){

  //find an unoccupied x
  for(var i=0;i<enemies.length;i++){
    var randomNum = Math.random();
    var whichStoneRow = Math.floor(randomNum*(3));
    while(blockIsOccupied(whichStoneRow,enemies)){
      whichStoneRow++;
      if(whichStoneRow>=3){
        whichStoneRow = 0;
        break;
      }
    }
    setPositionFromBlock(enemies[i],whichStoneRow*5);

    //slow
    if(randomNum < 0.1){
      enemies[i].speed = 200;
    }
    //fast
    else if(randomNum > 0.9){
      enemies[i].speed = 500;
    }
    //average
    else{
      enemies[i].speed = 300;
    }
  }

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [ new Enemy(), new Enemy(), new Enemy];
// Place the player object in a variable called player
var player = new Player();

initializeAllEnemies(allEnemies);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
