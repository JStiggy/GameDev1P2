/*
* Player object, user controlled character, has no movememnt restrictions
*
* @param game The current Phaser Game instance
* @param x The starting x location of the unit
* @param y The starting y location of the unit
*
*/

Player = function (game, x, y) {
    Phaser.Sprite.call(this, game, x*120+15, y*120, 'player');

    //Enable input and physics
    this.inputEnabled = true;
    this.events.onInputDown.add(onClickPlayer, this); 
    BookWyrm.game.physics.enable(this);

    //The number of miliseconds it takes the actor to move 1 tile (120 pixels)
    this.movememntSpeed = 1000;

    //Used for keeping track of the location in the grid
    this.xPos = x;
    this.yPos = y;

    //Allow for longer swipes
    this.xDest = x;
    this.yDest = y;
    //These are reversed as it makes the array much more user friendly for level building and debugging
    grid[y][x] = 1;

    this.animations.add("down", [0,1,2,3,4], 2, false);
    this.animations.add("left", [5,6,7,8,9], 2, false);
    this.animations.add("right", [10, 11, 12, 13, 14], 2, false);
    this.animations.add("up", [15, 16,17,18,19], 2, false);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() 
{
    movementHelper(this);
    //animationHelper(this);
}

//Values used for swiping
var startX;
var startY;
var endX;
var endY;

/*
* Start a swipe command with the currently pressed object
*
* @param obj the object being pressed by the user
* @param pointer the touch/mouse input
*
*/

function onClickPlayer (obj, pointer)
{
    //If the user taps on the object this will snap the unit ot the nearest tile
    obj.xDest = obj.xPos;
    obj.yDest = obj.yPos;

    //The swipe starts from the center of the unit, allows for more precise control
    startX = this.x + 60;
    startY = this.y + 60;

    this.events.onInputUp.add(endSwipePlayer, this);  
}

/*
* End a swipe command with the currently pressed object may cause the 
* object to move if the space is open
*
* @param obj the object being swiped by the user
* @param pointer the touch/mouse input
*
*/

function endSwipePlayer(obj, pointer){
    endX = BookWyrm.game.input.worldX;
    endY = BookWyrm.game.input.worldY;

    var distX = startX-endX;
    var distY = startY-endY;

    //Check to see if the user wants a horizontal swipe and the unit is not moving vertically
    if(Math.abs(distX)>Math.abs(distY)*2 && Math.abs(distX) > 80 && this.yPos * 120 === this.yDest*120){
        if(distX > 0 && grid[this.yPos][this.xPos-1] === 0){
            //Preppare to move the unit by some number of tiles
            this.xDest -= Math.max(1, Math.floor(distX/120));
        }
        if (distX < 0 && grid[this.yPos][this.xPos+1] === 0)
        {
            this.xDest += Math.max(1, Math.floor(-distX/120));
        }
        
    }
    //Check to see if the user wants a vertical swipe and the unit is not moving horizontally
    if(Math.abs(distY)>Math.abs(distX)*2 && Math.abs(distY) > 80 && this.x === (this.xDest*120+15) ){
        if(distY>0 && grid[this.yPos-1][this.xPos] === 0)
        {
            //Preppare to move the unit by some number of tiles
            this.yDest -= Math.max(1, Math.floor(distY/120));
        }
        if(distY<0 && grid[this.yPos+1][this.xPos] === 0)
        {
            this.yDest += Math.max(1, Math.floor(-distY/120));
        }
    }

    this.events.onInputUp.remove(endSwipePlayer, this);
}