
/*
* TextBox object used for any dialouge in the game
*
* @param game The current Phaser Game instance
* @param txtArray Array of text to display in the textbox
* @param state The state to transition to after completing the current text dialouge
*/

TextBox = function (game, txtArray, state) {
    Phaser.Sprite.call(this, game, 0, 1034, 'pMenu');
    this.fade = false;
    this.width = 750;
    this.height = 300;

    //Array of all text
    this.textArray = txtArray;
    //Advance the text at most 3 lines at a time, when all text has been depleted the state is changed
    this.advance = function()
    {
        BookWyrm.menuSound.play("", 0, 1, false, true);
        var i = 0;
        this.rawText = '';
        if(i+this.displayValue >= txtArray.length && !this.fade)
        {
            this.fade = true
            BookWyrm.game.camera.fade(0x000000, 500, true);
            BookWyrm.game.camera.onFadeComplete.add( function() {BookWyrm.game.state.start(this.stateToChange)}, this);
        }

        for(i = 0; i < 3 && (this.displayValue + i) < txtArray.length; ++i)
        {
           this.rawText += txtArray[i+this.displayValue] + "\n";
        }
        this.displayValue = i+this.displayValue
        this.displayText.text = this.rawText;
    }

    //Setup for the text to be displayed
    this.rawText = '';
    this.displayText = BookWyrm.game.add.text(this.x + 75, this.y + 60 , this.rawText, { font: '32px Arial', fill: '#0f0cf2' });
    this.displayText.stroke = "#1b85e8";
    this.displayText.strokeThickness = 16;
    this.displayValue = 0;

    //State to change the game to
    this.stateToChange = state;
    
    //All values for text display initialized, display text
    this.advance();

    // Enable input
    BookWyrm.game.input.onDown.add(this.advance, this); 
    this.inputEnabled = true;
};

TextBox.prototype = Object.create(Phaser.Sprite.prototype);
TextBox.prototype.constructor = TextBox;

TextBox.prototype.update = function()
{
    if( this.displayValue > this.textArray.length +1 && ! this.fade)
    {
        BookWyrm.game.camera.fade(0x000000,500);
        BookWyrm.game.camera.onFadeComplete.add( function() {BookWyrm.game.state.start(this.stateToChange)}, this);
    }
}