var BookWyrm = BookWyrm || {};

BookWyrm.Title = function(){};
 
//Main Gameplay State
BookWyrm.Title.prototype = {
    create:create,
    update:update    
};

function create()
{
    //logo
    BookWyrm.game.add.sprite(BookWyrm.game.camera.width/2-190, 250, 'logo');



    BookWyrm.music.stop();
    BookWyrm.music = BookWyrm.game.add.audio('title', 1, true);
    BookWyrm.music.fadeIn(1500);

    //play button
    var buttonGroup = BookWyrm.game.add.group();
    buttonGroup.add(new GameButton(BookWyrm.game, BookWyrm.game.camera.width/2, BookWyrm.game.camera.height/2+200, 'start' , 
        function () {
            BookWyrm.game.camera.fade(0x000000,500);
            BookWyrm.music.fadeOut(500);

            BookWyrm.music = BookWyrm.game.add.audio('game', 1, true);
            BookWyrm.music.fadeIn(1000);
            BookWyrm.menuSound.play("", 0, 1, false, true);
            BookWyrm.game.camera.onFadeComplete.add( function() {BookWyrm.game.state.start('Intro')}, this);
        } ));
}

function update()
{
    
}