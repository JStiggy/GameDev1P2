var BookWyrm = BookWyrm || {};

BookWyrm.End = function(){};
 
//Main Gameplay State
BookWyrm.End.prototype = {
    create:create,
    update:update    
};

function create()
{
    var textGroup = BookWyrm.game.add.group();
    textGroup.add(new TextBox(BookWyrm.game, ["Dragon", "Books", "Kids", "returned", "Librarians", "defeated"], 'Title'));
    BookWyrm.game.camera.flash(0x000000, 1000);
}