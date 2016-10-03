/*
* Collectible object, moves either horizontally or vertically
*
* @param game The current Phaser Game instance
* @param x The x location of the unit
* @param y The y location of the unit
*
*/

Collectible = function (game, x, y) {
    Phaser.Sprite.call(this, game, x*120, y*120, 'book');
    //Enable input and physics
    this.inputEnabled = true;
    this.events.onInputDown.add(onClickCollectible, this); 
    BookWyrm.game.physics.enable(this);

    //Used for keeping track of the location in the grid
    this.xPos = x;
    this.yPos = y;

    //These are reversed as it makes the array much more user friendly for level building and debugging
    grid[y][x] = 1;
};

Collectible.prototype = Object.create(Phaser.Sprite.prototype);
Collectible.prototype.constructor = Collectible;

//Values used for swiping

/*
* Start a swipe command with the currently pressed object, if the player is adjacent to the book,
* remove the book from play.
*
* @param obj the object being pressed by the user
* @param pointer the touch/mouse input
*
*/

function onClickCollectible (obj, pointer)
{
    if(Math.abs(obj.xPos - player.xPos - player.yPos + obj.yPos) === 1)
    {
        grid[obj.yPos][obj.xPos] = 0;
        obj.destroy();
    }
}