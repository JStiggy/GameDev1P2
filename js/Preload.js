var BookWyrm = BookWyrm || {};
 
//State that loads all the game files
BookWyrm.Preload = function(){};
 
BookWyrm.Preload.prototype = {
  preload: function() {
    //Show the loading screen while all the actual game assets are loaded in the background
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.load.setPreloadSprite(this.preloadBar);
 
    //Load all Level JSON files
    this.load.tilemap('level1', 'assets/tilemaps/TestMap.json', null, Phaser.Tilemap.TILED_JSON);
    
    //Load all art assets
    this.load.image('gameTiles', 'assets/tiles/Tileset.png');
    this.load.image('cart0', 'assets/tiles/CartV.png');
    this.load.image('cart1', 'assets/tiles/CartH.png');
    this.load.image('chair', 'assets/tiles/Chair.png');
    this.load.image('player', 'assets/tiles/Player.png');
    this.load.image('book', 'assets/tiles/Book.png');
    this.load.image('exit', 'assets/tiles/Exit.png');
    this.load.image('librarian', 'assets/tiles/Librarian.png');
  },
  create: function() {
    //Start the actual Game State
    this.state.start('Title');
  }
};