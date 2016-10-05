var BookWyrm = BookWyrm || {};

BookWyrm.Title = function(){};
 
//Main Gameplay State
BookWyrm.Title.prototype = {
    create:create,
    update:update    
};

function create()
{
	console.log("title screen");

    // Create a label to use as a button
    play_label = BookWyrm.game.add.text(BookWyrm.game.camera.width/2-65, BookWyrm.game.camera.height/2, 'Play', { font: '62px Arial', fill: '#0f0cf2' });
    play_label.stroke = "#1b85e8";
    play_label.strokeThickness = 16;
    //  Apply the shadow to the Stroke only
    play_label.setShadow(2, 2, "#333333", 2, true, false);
    play_label.fixedToCamera = true;

    play_label.inputEnabled = true;
    play_label.events.onInputUp.add(function () {
        // When the play button is pressed, we start the game
        BookWyrm.game.state.start('Game');
        
    });

    
    

}

function update()
{
    
}



