var BookWyrm = BookWyrm || {};

BookWyrm.End = function(){};
 
//Main Gameplay State
BookWyrm.End.prototype = {
    create:create,
    update:update    
};

var cutsceneStills = 4;
var	currentStill = 4;

function create()
{
    BookWyrm.music.loop = true;

	cutsceneStills = 4;
	currentStill = 4;
	cutsceneImage = BookWyrm.game.add.sprite(0, 0, 'still' + currentStill.toString());
    var textGroup = BookWyrm.game.add.group();
    BookWyrm.game.input.onDown.add(function() {	currentStill++;
    											if(currentStill > cutsceneStills)
    											{
    											 	currentStill = cutsceneStills;
    											}
    											cutsceneImage.loadTexture('still' + currentStill.toString());  
    										}, self); 
    var textGroup = BookWyrm.game.add.group();
    textGroup.add(new TextBox(BookWyrm.game, ["You got all the books back!"], 'Title'));
    BookWyrm.game.camera.flash(0x000000, 1000);
}