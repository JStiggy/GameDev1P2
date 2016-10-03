/*
* Player object, user controlled character, has no movememnt restrictions
*
* @param game The current Phaser Game instance
* @param x The starting x location of the unit
* @param y The starting y location of the unit
*
*/

Player = function (game, x, y) {
    Phaser.Sprite.call(this, game, x*120, y*120, 'player');

    //Enable input and physics
    this.inputEnabled = true;
    this.events.onInputDown.add(onClickPlayer, this); 
    BookWyrm.game.physics.enable(this);

    //Used for keeping track of the location in the grid
    this.xPos = x;
    this.yPos = y;

    //These are reversed as it makes the array much more user friendly for level building and debugging
    grid[y][x] = 1;
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

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
    startX = BookWyrm.game.input.worldX;
    startY = BookWyrm.game.input.worldY;
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

    if(Math.abs(distX)>Math.abs(distY)*2 && Math.abs(distX) > 80){
        if(distX > 0 && checkLocation(this.xPos, this.yPos, this.xPos-1, this.yPos)){
            this.canMove = false;
            //this.x -= 120;
            this.xPos--;
            smoothMovement(this, 1000);
        }
        if (distX < 0 && checkLocation(this.xPos, this.yPos, this.xPos+1, this.yPos))
        {
            this.canMove = false;
            //this.x += 120;
            this.xPos++;
            smoothMovement(this, 1000);
        }
        
    }

    if(Math.abs(distY)>Math.abs(distX)*2 && Math.abs(distY) > 80){
        if(distY>0 && checkLocation(this.xPos, this.yPos, this.xPos, this.yPos-1))
        {
            this.canMove = false;
            //this.y -= 120;
            this.yPos--;
            smoothMovement(this, 1000);
        }
        if(distY<0 && checkLocation(this.xPos, this.yPos, this.xPos, this.yPos+1))
        {
            this.canMove = false;
            //this.y += 120;
            this.yPos++;
            smoothMovement(this, 1000);
        }
    }

    this.events.onInputUp.remove(endSwipePlayer, this);
}