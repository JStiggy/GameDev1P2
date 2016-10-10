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
    this.load.json('level1Data', 'assets/tilemaps/TestMap.json');

    this.load.tilemap('level2', 'assets/tilemaps/TestMap2.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.json('level2Data', 'assets/tilemaps/TestMap2.json');

    //Load all art assets
    this.load.image('gameTiles', 'assets/tiles/Tileset.png');
    this.load.image('cart0', 'assets/tiles/CartV.png');
    this.load.image('cart1', 'assets/tiles/CartH.png');
    this.load.image('chair', 'assets/tiles/Chair.png');
    this.load.image('player', 'assets/tiles/Player.png');
    this.load.image('book', 'assets/tiles/Book.png');
    this.load.image('exit', 'assets/tiles/Exit.png');
    this.load.image('librarian', 'assets/tiles/Librarian.png');
    this.load.image('textbox', 'assets/TextBox.png');
    this.load.image('star', 'assets/star.png');

    this.load.image('cBL', 'assets/tiles/Children Section/BottomLeft.png');
    this.load.image('cBR', 'assets/tiles/Children Section/BottomRight.png');
    this.load.image('cBVE', 'assets/tiles/Children Section/BottomVerticalEnd.png');
    this.load.image('cF', 'assets/tiles/Children Section/Floor.png');
    this.load.image('cLVE', 'assets/tiles/Children Section/LeftVerticalEnd.png');
    this.load.image('cMC', 'assets/tiles/Children Section/MiddleConnect.png');
    this.load.image('cRVE', 'assets/tiles/Children Section/RightVerticalEnd.png');
    this.load.image('cTL', 'assets/tiles/Children Section/TopLeft.png');
    this.load.image('cTR', 'assets/tiles/Children Section/TopRight.png');
    this.load.image('cTVE', 'assets/tiles/Children Section/TopVerticalEnd.png');
    this.load.image('cVM', 'assets/tiles/Children Section/VerticalMiddle.png');

    this.load.audio('title', ['assets/music/ES_Childrens_Game_3_-_Anders_M_rlin_.ogg']);
    this.load.audio('game', ['assets/music/ES_Childrens_Game_4_-_Anders_M_rlin_.ogg']);

    this.load.audio('collectible', ['assets/sfx/pickup.ogg']);
    this.load.audio('cartPush', ['assets/sfx/foley_mirror_no_frame_drag_on_table_001.ogg']);
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