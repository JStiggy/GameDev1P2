/*
* Collectible object, moves either horizontally or vertically
*
* @param game The current Phaser Game instance
* @param x The x location of the unit
* @param y The y location of the unit
*
*/

Collectible = function (game, x, y) {
    Phaser.Sprite.call(this, game, x*120 + 75, y*120 + 60, 'book');
    //Enable input and physics
    this.inputEnabled = true;
    this.events.onInputDown.add(onClickCollectible, this); 
    BookWyrm.game.physics.enable(this);

    //Used for keeping track of the location in the grid
    this.xPos = x;
    this.yPos = y;
    this.angle = -45;

    //These are reversed as it makes the array much more user friendly for level building and debugging
    grid[y][x] = 1;

    this.anchor.set(.5);

    this.emitter = BookWyrm.game.add.emitter(this.x, this.y, 15);
    this.emitter.makeParticles('star');
    this.emitter.gravity = 0;
    this.emitter.setAlpha(1, 0, 1600);


    this.tweenR = game.add.tween(this).to( { angle: 45 }, 2000, Phaser.Easing.Exponential.In, true);
    this.tweenL = game.add.tween(this).to( { angle: -45 }, 2000, Phaser.Easing.Exponential.In, false);

    this.tweenR.onComplete.add(function(){this.tweenL.start()}, this);
    this.tweenL.onComplete.add(function(){this.tweenR.start()}, this);

    this.sound = BookWyrm.game.add.audio("collectible", 1, false);
};

Collectible.prototype = Object.create(Phaser.Sprite.prototype);
Collectible.prototype.constructor = Collectible;

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
    if(Phaser.Math.distance(this.x, this.y, player.x+60,player.y+60) < 130)
    {
        obj.emitter.start(true, 1500, 50, 15);
        obj.sound.play();
        obj.alpha = 0;
        grid[obj.yPos][obj.xPos] = 0;
        obj.inputEnabled = false
        booksFound +=1;
        BookWyrm.game.time.events.add(1600, function(){obj.destroy();})
    }
}