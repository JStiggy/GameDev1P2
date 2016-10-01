var Cart = function(game, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'cart');
  	this.inputEnabled = true;
    this.events.onInputDown.add(onClick, this); 
    game.physics.enable(this);
};

Cart.prototype = Object.create(Phaser.Sprite.prototype);

Cart.prototype.constructor = Cart;

Cart.prototype.update = function() {

};

