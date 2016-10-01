var BookWyrm = BookWyrm || {};

//Set up the Game, refer to the game by BookWyrm.game, 
//ie:  BookWyrm.game.physics.startSystem(Phaser.Physics.ARCADE); 
BookWyrm.game = new Phaser.Game(1334, 750, Phaser.AUTO, '');
 
//All the states in the game, a title screen etc could be added by adding new states
//States are held within their own JavaScript file
BookWyrm.game.state.add('Boot', BookWyrm.Boot);
BookWyrm.game.state.add('Preload', BookWyrm.Preload);
BookWyrm.game.state.add('Game', BookWyrm.Game);
BookWyrm.game.state.start('Boot');