
/*
* Collectible object, moves either horizontally or vertically
*
* @param game The current Phaser Game instance
* @param x The x location of the unit
* @param y The y location of the unit
*
*/

Exit = function (game, x, y) {
    Phaser.Sprite.call(this, game, x*120 + 15, y*120, 'exit');
    //Enable physics
    BookWyrm.game.physics.enable(this);

    this.currentLevel = level;
    //Used for keeping track of the location in the grid
    this.xPos = x;
    this.yPos = y;

};

Exit.prototype = Object.create(Phaser.Sprite.prototype);
Exit.prototype.constructor = Exit;

Exit.prototype.update = function() 
{
    if ( Phaser.Math.distance(this.x + 60, this.y + 60, player.x + 60, player.y + 60) < 10 && (collectibleObjects.length === 0) )
    {             
        BookWyrm.game.camera.fade(0x000000,500);
        BookWyrm.game.camera.onFadeComplete.add(reloadScene, this);
        level = this.currentLevel + 1;
    } 
}