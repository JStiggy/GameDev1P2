var BookWyrm = BookWyrm || {};
 
BookWyrm.Boot = function(){};
 
//setting game configuration and loading the assets for the loading screen
BookWyrm.Boot.prototype = {
  preload: function() {
    //Sets up a loading bar, renders portions of the image
    this.load.image('preloadbar', 'assets/tiles/cart.png');
  },
  create: function() {
    this.game.stage.backgroundColor = '#000000';
    //Centers the canvas to the center of the screen
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    //Start preloading all assets
    this.state.start('Preload');
  }
};