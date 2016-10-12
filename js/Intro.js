var BookWyrm = BookWyrm || {};

BookWyrm.Intro = function(){};
 
//Main Gameplay State
BookWyrm.Intro.prototype = {
    create:create,
    update:update    
};

var cutsceneStills = 3;
var	currentStill = 1;

function create()
{
    BookWyrm.music.loop = true;
    
	cutsceneStills = 3;
	currentStill = 1;
	cutsceneImage = BookWyrm.game.add.sprite(0, 0, 'still' + currentStill.toString());
    var textGroup = BookWyrm.game.add.group();
    BookWyrm.game.input.onDown.add(function() {	currentStill++;
    											if(currentStill > cutsceneStills)
    											{
    											 	currentStill = cutsceneStills;
    											}
    											cutsceneImage.loadTexture('still' + currentStill.toString());  
    										}, self); 
    textGroup.add(new TextBox(BookWyrm.game, ["There once was a monster named", "the BookWyrm.", "",
    										  "His home was a library and he was never", " happier than when sharing his books with", "visitors.", 
    										  "Unfortunately the new librarian keeps trying ", "to kick the the bookwyrm out ...", "",
    										   "... but he just sneaks back for more books", "as her back is turned." ], 'Game'));
    BookWyrm.game.camera.flash(0x000000, 1000);
}