/*
* Cart object, moves either horizontally or vertically
*
* @param game The current Phaser Game instance
* @param x The starting x location of the unit
* @param y The starting y location of the unit
*
*/

Chair = function (game, x, y) {
    Phaser.Sprite.call(this, game, x*120, y*120, 'chair');
    //Enable input and physics
    this.inputEnabled = true;
    this.events.onInputDown.add(onClickChair, this); 
    BookWyrm.game.physics.enable(this);

    //Determines if the unit can move, set to false after moving once
    this.canMove = true;
    //Used for keeping track of the location in the grid
    this.xPos = x;
    this.yPos = y;

    //These are reversed as it makes the array much more user friendly for level building and debugging
    grid[y][x] = 1;
};

Chair.prototype = Object.create(Phaser.Sprite.prototype);
Chair.prototype.constructor = Cart;

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

function onClickChair (obj, pointer)
{
    startX = BookWyrm.game.input.worldX;
    startY = BookWyrm.game.input.worldY;
    this.events.onInputUp.add(endSwipeChair, this);  
}

/*
* End a swipe command with the currently pressed object may cause the 
* object to move if the space is open
*
* @param obj the object being swiped by the user
* @param pointer the touch/mouse input
*
*/

function endSwipeChair(obj, pointer){
    endX = BookWyrm.game.input.worldX;
    endY = BookWyrm.game.input.worldY;

    console.log(interactableObjects.length);

    var distX = startX-endX;
    var distY = startY-endY;

    if(Math.abs(distX)>Math.abs(distY)*2 && Math.abs(distX) > 80 && this.canMove){
        if(distX > 0 && checkLocation(this.xPos, this.yPos, this.xPos-1, this.yPos)){
            this.canMove = false;
            //this.x -= 120;
            this.xPos--;
            smoothMovement(this);
        }
        if (distX < 0 && checkLocation(this.xPos, this.yPos, this.xPos+1, this.yPos))
        {
            this.canMove = false;
            //this.x += 120;
            this.xPos++;
            smoothMovement(this);
        }
        
    }

    if(Math.abs(distY)>Math.abs(distX)*2 && Math.abs(distY) > 80 && this.canMove){
        if(distY>0 && checkLocation(this.xPos, this.yPos, this.xPos, this.yPos-1))
        {
            this.canMove = false;
            //this.y -= 120;
            this.yPos--;
            smoothMovement(this);
        }
        if(distY<0 && checkLocation(this.xPos, this.yPos, this.xPos, this.yPos+1))
        {
            this.canMove = false;
            //this.y += 120;
            this.yPos++;
            smoothMovement(this);
        }
    }

    this.events.onInputUp.remove(endSwipeChair, this);
}