var BookWyrm = BookWyrm || {};

BookWyrm.Intro = function(){};
 
//Main Gameplay State
BookWyrm.Intro.prototype = {
    create:create,
    update:update    
};

function create()
{
    var textGroup = BookWyrm.game.add.group();
    textGroup.add(new TextBox(BookWyrm.game, ["Dragon", "Books", "Kids", "stolen", "Librarians", "evil"], 'Game'));
    BookWyrm.game.camera.flash(0x000000, 1000);
}