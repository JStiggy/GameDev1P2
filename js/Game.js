var BookWyrm = BookWyrm || {};

BookWyrm.Game = function(){};
 
//Main Gameplay State
BookWyrm.Game.prototype = {
    create:create,
    update:update    
};

//List of all interactable objects in the stage
var interactableObjects;

//List of all remaining books in the scene. This can be used to
//determine the number of books left in the stage
var collectibleObjects;

//Enemy group
var enemyObjects;

//Player object used by other objects
var player;
var exit;

/**
* This is the grid representing the level. As objects are added to the level, 
* they will add a 1 to the proper spot. 1 indicates inpassable, 0 indicates 
* passable. Note, the grid uses y as its first index grid[y][x] is proper usage
* Since the game scrolls only vertically, this means we can just add new subarrays
* to the bottom instead of having to append new values to each sub array which 
* could get really messy. To increase vertical length, add a new subarray
**/

var grid;

var text1;
var booksFound = 0;


var w = 750, h = 1334;

function create()
{
    grid = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ];

    BookWyrm.game.physics.startSystem(Phaser.Physics.ARCADE);

    collectibleObjects = BookWyrm.game.add.group();
    collectibleObjects.add(new Collectible(BookWyrm.game, 4, 2));

    enemyObjects = BookWyrm.game.add.group();
    enemyObjects.add(new Librarian(BookWyrm.game, 1, 1));


    interactableObjects = BookWyrm.game.add.group();
    interactableObjects.add(exit = new Exit(BookWyrm.game, 0, 5));
    interactableObjects.add(new Cart(BookWyrm.game, 5, 1, 1));
    interactableObjects.add(new Cart(BookWyrm.game, 0, 0, 0));
    interactableObjects.add(new Cart(BookWyrm.game, 3, 3 , 0));
    interactableObjects.add(new Chair(BookWyrm.game, 2, 1));
    interactableObjects.add(new Chair(BookWyrm.game, 2, 2));
    interactableObjects.add(new Chair(BookWyrm.game, 0, 2));
    interactableObjects.add(player = new Player(BookWyrm.game, 5, 5));

    BookWyrm.game.camera.bounds = new Phaser.Rectangle(0,0,750,2640);
    BookWyrm.game.camera.follow(player);

    text1 = BookWyrm.game.add.text(20, 1254, "Books Found: ", { font: "25px Arial Black", fill: "#0f0cf2" });
    text1.stroke = "#1b85e8";
    text1.strokeThickness = 16;
    //  Apply the shadow to the Stroke only
    text1.setShadow(2, 2, "#333333", 2, true, false);
    text1.fixedToCamera = true;

    // Create a label to use as a button
    pause_label = BookWyrm.game.add.text(w - 100, 20, 'Pause', { font: '24px Arial', fill: '#fff' });
    pause_label.fixedToCamera = true;
    pause_label.inputEnabled = true;
    pause_label.events.onInputUp.add(function () {
        // When the paus button is pressed, we pause the game
        BookWyrm.game.paused = true;

        // Create a label to use as a button
        menu_label = BookWyrm.game.add.text(BookWyrm.game.camera.width/2-75, BookWyrm.game.camera.height/2-50, 'Menu', { font: '62px Arial', fill: '#0f0cf2' });
        menu_label.stroke = "#1b85e8";
        menu_label.strokeThickness = 16;
        //  Apply the shadow to the Stroke only
        menu_label.setShadow(2, 2, "#333333", 2, true, false);
        menu_label.fixedToCamera = true;
        menu_label.inputEnabled = true;

        restart_label = BookWyrm.game.add.text(BookWyrm.game.camera.width/2-75, BookWyrm.game.camera.height/2+30, 'Restart', { font: '62px Arial', fill: '#0f0cf2' });
        restart_label.stroke = "#1b85e8";
        restart_label.strokeThickness = 16;
        //  Apply the shadow to the Stroke only
        restart_label.setShadow(2, 2, "#333333", 2, true, false);
        restart_label.fixedToCamera = true;
        restart_label.inputEnabled = true;
        

        // And a label to illustrate which menu item was chosen. (This is not necessary)
        choiseLabel = BookWyrm.game.add.text(BookWyrm.game.camera.x + BookWyrm.game.camera.width/2, BookWyrm.game.camera.y + BookWyrm.game.camera.height-150, 'Click outside menu to continue', { font: '30px Arial', fill: '#fff' });
        choiseLabel.anchor.setTo(0.5, 0.5);
        
    });

    // Add a input listener that can help us return from being paused
    BookWyrm.game.input.onDown.add(unpause, self);

    // And finally the method that handels the pause menu
    function unpause(event){
        // Only act if paused
        if(BookWyrm.game.paused){
            // Calculate the corners of the menu
            var x1 = BookWyrm.game.camera.width/2-75, x2 = BookWyrm.game.camera.width/2+95;
            var y1 = BookWyrm.game.camera.height/2-50, y2 = BookWyrm.game.camera.height/2-50+62;

            var x3 = BookWyrm.game.camera.width/2-75, x4 = BookWyrm.game.camera.width/2+120;
            var y3 = BookWyrm.game.camera.height/2+30, y4 = BookWyrm.game.camera.height/2+30+62;

            // Check if the click was inside the menu
            if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
                BookWyrm.game.paused = false;
                BookWyrm.game.state.start('Title');
            }
            else if(event.x > x3 && event.x < x4 && event.y > y3 && event.y < y4 ){
                BookWyrm.game.paused = false;
                booksFound = 0;
                BookWyrm.game.state.start('Game');
            }
            else{
                // Remove the menu and the label
                menu_label.destroy();
                choiseLabel.destroy();
                restart_label.destroy();

                // Unpause the game
                BookWyrm.game.paused = false;
            }
        }
    };

}

function update()
{
    this.physics.arcade.collide(interactableObjects, interactableObjects); //I dont think this is needed as all interactables should never touch do to grid movement, but its nice to have just incase
    text1.text = "Books Found: " + booksFound + "/" + collectibleObjects.length;
}

/*
* Check if a location can be moved to, if so move the  unit to the location
* Note while the arguments are x,y,x,y the code uses y first
* 
* @param x The starting x location of the unit
* @param y The starting y location of the unit
* @param xDestination The ending x location of the unit
* @param yDestination The ending y location of the unit
* @return Boolean if the movement was succesful
*/

function checkLocation(x, y, xDestination, yDestination) 
{

    if(grid[yDestination][xDestination] === 0)
    {
        grid[yDestination][xDestination] = 1;
        grid[y][x] = 0;
        //console.table(grid); //Debug tool, shows the grid in the console
        return true;
    }
    else
    {
        return false;
    }
}

/*
* Smoothly move a unit from its current position to it's destination position
*
* @param unit The unit that will be moved
* @param time Time in miliseconds for the tween
*
*/

function smoothMovement(unit, time)
{
  BookWyrm.game.add.tween(unit).to( { x: unit.xPos * 120 + 15, y: unit.yPos * 120 }, time, Phaser.Easing.linear, true);
}

function movementHelper(unit){
   if (unit.xPos !== unit.xDest && (unit.xPos * 120 + 15) == unit.x && unit.yPos * 120 == unit.y)
    {
        if(unit.xPos < unit.xDest && checkLocation(unit.xPos, unit.yPos, unit.xPos+1, unit.yPos))
        {
            unit.xPos++;
        } 
        else if (unit.xPos < unit.xDest && grid[unit.yPos][unit.xPos+1] === 1)
        {
            unit.xDest = unit.xPos;
        }

        if(unit.xPos > unit.xDest && checkLocation(unit.xPos, unit.yPos, unit.xPos-1, unit.yPos))
        {
            unit.xPos--;
        } 
        else if (unit.xPos > unit.xDest && grid[unit.yPos][unit.xPos-1] === 1)
        {
            unit.xDest = unit.xPos;
        }

        smoothMovement(unit,1000);
    } 

    if (unit.yPos !== unit.yDest && unit.yPos * 120 == unit.y && (unit.xPos * 120 + 15) == unit.x)
    {
        if(unit.yPos < unit.yDest && checkLocation(unit.xPos, unit.yPos, unit.xPos, unit.yPos+1))
        {
            unit.yPos++;
        } 
        else if (unit.yPos < unit.yDest && grid[unit.yPos+1][unit.xPos] === 1)
        {
            unit.yDest = unit.yPos;
        }

        if(unit.yPos > unit.yDest && checkLocation(unit.xPos, unit.yPos, unit.xPos, unit.yPos-1))
        {
            unit.yPos--;
        } 
        else if (unit.yPos > unit.yDest && grid[unit.yPos-1][unit.xPos] === 1)
        {
            unit.yDest = unit.yPos;
        }

        smoothMovement(unit,1000);
    }
}

function reloadScene()
{
    booksFound = 0;
    BookWyrm.game.state.start(BookWyrm.game.state.current);
}