/*
* Allow for modular buttons, play the menu icon sound when the user presses it
*
* @param game The current Phaser Game instance
* @param xOffset The x offset based on the camera
* @param yOffset The y offset based on the camera
* @param image The key for the image asset
* @param userFunction The button will run the function given, when pressed by the user
*/

GameButton = function (game, xOffset, yOffset, image, userFunction) {
    Phaser.Sprite.call(this, game, xOffset, yOffset, image);
    //Enable input and physics
    this.inputEnabled = true;
    this.events.onInputUp.add( function() {
        BookWyrm.menuSound.play("", 0, 1, false, true);
        userFunction();
    }, this); 
    BookWyrm.game.physics.enable(this);

    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.anchor.set(.5);
};

GameButton.prototype = Object.create(Phaser.Sprite.prototype);
GameButton.prototype.constructor = GameButton;
GameButton.prototype.update = function()
{
    this.x = BookWyrm.game.camera.x + this.xOffset;
    this.y = BookWyrm.game.camera.y + this.yOffset;
}
