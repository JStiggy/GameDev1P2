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
    this.load.tilemap('level1', 'assets/tilemaps/Level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.json('level1Data', 'assets/tilemaps/Level1.json');

    this.load.tilemap('level2', 'assets/tilemaps/Level2.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.json('level2Data', 'assets/tilemaps/Level2.json');

    this.load.tilemap('level3', 'assets/tilemaps/Level3.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.json('level3Data', 'assets/tilemaps/Level3.json');

    //Load all art assets
    this.load.image('gameTiles', 'assets/tiles/Tileset.png');
    this.load.image('cart2', 'assets/tiles/CartVA.png');
    this.load.image('cart1', 'assets/tiles/CartHA.png');
    this.load.image('cart3', 'assets/tiles/CartVC.png');
    this.load.image('cart4', 'assets/tiles/CartHC.png');
    this.load.image('chair1', 'assets/tiles/ChairA.png');
    this.load.image('chair2', 'assets/tiles/ChairC.png');
    this.load.spritesheet('player', 'assets/tiles/Player.png', 120, 120);
    this.load.image('exit', 'assets/tiles/Exit.png');
    this.load.spritesheet('librarian', 'assets/tiles/Librarian.png', 120, 120);
    this.load.image('textbox', 'assets/TextBox.png');
    this.load.image('star', 'assets/star.png');

    for(var i = 0; i < 13; ++i)
    {
        this.load.image('book' + i.toString(), 'assets/tiles/Book' + i.toString() + '.png');
    }

    this.load.image('start', 'assets/tiles/UI/start.png');
    this.load.image('menu', 'assets/tiles/UI/menu.png');
    this.load.image('restart', 'assets/tiles/UI/restart.png');
    this.load.image('pause', 'assets/tiles/UI/pause.png');
    this.load.image('pMenu', 'assets/tiles/UI/pause_menu.png');

    this.load.audio('title', ['assets/music/ES_Childrens_Game_3_-_Anders_M_rlin_.ogg']);
    this.load.audio('game', ['assets/music/ES_Childrens_Game_4_-_Anders_M_rlin_.ogg']);

    this.load.audio('collectible', ['assets/sfx/pickup.ogg']);
    this.load.audio('cartPush', ['assets/sfx/wheel.ogg']);
    this.load.audio('chairPush', ['assets/sfx/household_chair_wooden_scraping_on_floor.ogg']);
    this.load.audio('levelClear', ['assets/sfx/household_window_double_glazed_shut.ogg']);
    this.load.audio('lose', ['assets/sfx/enemyhit.ogg']);
    this.load.audio('menu', ['assets/sfx/sound_Button_Tick.ogg']);
  },
  create: function() {
    //Start the actual Game State
    BookWyrm.music = BookWyrm.game.add.audio('title');
    BookWyrm.menuSound = BookWyrm.game.add.audio('menu');
    BookWyrm.music.onDecoded.add(function() {BookWyrm.game.state.start('Title');}, this);
    
  }
};