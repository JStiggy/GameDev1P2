/*
* Cart object, moves either horizontally or vertically
*
* @param game The current Phaser Game instance
* @param x The starting x location of the unit
* @param y The starting y location of the unit
* @param d The direction the unit moves in 1 is horizontal, 0 vertical
*
*/

Cart = function (game, x, y, d) {
    Phaser.Sprite.call(this, game, x*120, y*120, 'cart' + d.toString());
    
    //Enable input and physics
    this.inputEnabled = true;
    this.events.onInputDown.add(onClick, this); 
    BookWyrm.game.physics.enable(this);
    
    //The direction the cart moves in 1 is horizontal, 0 vertical
    this.direction = d;
   
    //Used for keeping track of the location in the grid
    this.xPos = x;
    this.yPos = y;

    //These are reversed as it makes the array much more user friendly for level building and debugging
    grid[y][x] = 1;
};

Cart.prototype = Object.create(Phaser.Sprite.prototype);
Cart.prototype.constructor = Cart;

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

function onClick (obj, pointer)
{
    startX = BookWyrm.game.input.worldX;
    startY = BookWyrm.game.input.worldY;
    this.events.onInputUp.add(endSwipe, this);  
}

/*
* End a swipe command with the currently pressed object may cause the 
* object to move if the space is open
*
* @param obj the object being swiped by the user
* @param pointer the touch/mouse input
*
*/

function endSwipe(obj, pointer){
    endX = BookWyrm.game.input.worldX;
    endY = BookWyrm.game.input.worldY;

    var distX = startX-endX;
    var distY = startY-endY;

    if(Math.abs(distX)>Math.abs(distY)*2 && Math.abs(distX) > 80 && this.direction === 1){
        if(distX > 0 && checkLocation(this.xPos, this.yPos, this.xPos-1, this.yPos))
        {
            //this.x -= 120;
            this.xPos--;
            smoothMovement(this, 1000);
        }
        if (distX < 0 && checkLocation(this.xPos, this.yPos, this.xPos+1, this.yPos))
        {
            //this.x += 120;
            this.xPos++;
            smoothMovement(this, 1000);
        }
    }

    if(Math.abs(distY)>Math.abs(distX)*2 && Math.abs(distY) > 80 && this.direction === 0){
        if(distY>0 && checkLocation(this.xPos, this.yPos, this.xPos, this.yPos-1))
        {
            //this.y -= 120;
            this.yPos--;
            smoothMovement(this, 1000);
        }
        if(distY<0 && checkLocation(this.xPos, this.yPos, this.xPos, this.yPos+1))
        {
            //this.y += 120;
            this.yPos++;
            smoothMovement(this, 1000);
        }
    }

    this.events.onInputUp.remove(endSwipe, this);
}