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

/**
* This is the grid representing the level. As objects are added to the level, 
* they will add a 1 to the proper spot. 1 indicates inpassable, 0 indicates 
* passable. Note, the grid uses y as its first index grid[y][x] is proper usage
* Since the game scrolls only vertically, this means we can just add new subarrays
* to the bottom instead of having to append new values to each sub array which 
* could get really messy. To increase vertical length, add a new subarray
**/

var grid;

//Data used to represent the current level
var map;
var layer1;
var layer2;
var level = 1;

var border;

var text1;
var booksFound = 0;


var w = 750, h = 1334;

function create()
{
    BookWyrm.music.fadeOut(500);

    BookWyrm.music = BookWyrm.game.add.audio('game', 0, 1, true);
    BookWyrm.music.play('', 0, 1, true);
    BookWyrm.music.fadeIn(1000);
    BookWyrm.music.loop = true;

    //Add a 15 pixel border to the sides of the screen
    border = this.game.add.graphics(0, 0);        
    border.beginFill(0x670A0A, 1);        
    border.drawRect(0, 0, BookWyrm.game.width, BookWyrm.game.height);                
    border.endFill();   

    //Initialize the grid as empty
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

    //Load all the map data into the game
    map = BookWyrm.game.add.tilemap('level' + level.toString());
    jsonData = BookWyrm.game.cache.getJSON('level'+level.toString()+'Data');

    //  First value is the name given to the tileset when added to tiled, the second is the
    map.addTilesetImage(jsonData.tilesets[0].name, 'gameTiles');

    //Create the two layers for the map
    //The anchor points seem oddly specific, thats because Phaser has no easy way place tile maps at a certain point
    //as a result the anchor point is exactly 15 pixels horizontally
    layer1 = map.createLayer('Tile Layer 1');
    layer1.anchor.set(-26/1334, 0);

    layer2 = map.createLayer('Tile Layer 2');
    layer2.anchor.set(-26/1334, 0);
    
    //
    // Add any objects for groups here
    //

    collectibleObjects = BookWyrm.game.add.group();
    enemyObjects = BookWyrm.game.add.group();
    interactableObjects = BookWyrm.game.add.group();

    //Iterate though all the map data to create collisions and add objects to the game
    var tiles = 0;
    var i = 0;
    var j = 0;
    for(i=0; i<22 && tiles < jsonData.layers[1].data.length; ++i)
    {
        for(j=0; j<6 && tiles < jsonData.layers[1].data.length; ++j)
        {
            if(jsonData.layers[1].data[tiles] !== 0)
            {
                grid[i][j] = 1;
            }
            if(jsonData.layers[2].data[tiles] !== 0)
            {
                switch(jsonData.layers[2].data[tiles]){
                    case 0:
                        break;
                    case 40:
                        interactableObjects.add(new Cart(BookWyrm.game,j,i,1,1));
                        break;
                    case 41:
                        interactableObjects.add(new Cart(BookWyrm.game,j,i,0,2));
                        break;
                    case 42:
                        interactableObjects.add(new Cart(BookWyrm.game,j,i,0,3));
                        break;
                    case 43:
                        interactableObjects.add(new Cart(BookWyrm.game,j,i,1,4));
                        break;   
                    case 44:
                        interactableObjects.add(new Chair(BookWyrm.game,j,i,2));
                        break;
                    case 45:
                        interactableObjects.add(new Chair(BookWyrm.game,j,i,1));
                        break;
                    case 46:
                        collectibleObjects.add(new Collectible(BookWyrm.game,j,i,0));
                        break;
                    case 47:
                        interactableObjects.add(new Exit(BookWyrm.game,j,i));
                        break;
                    case 48:
                        enemyObjects.add(new Librarian(BookWyrm.game,j,i));
                        break;
                    case 49:
                        interactableObjects.add(player = new Player(BookWyrm.game,j,i));
                        break;
                    case 50:
                        collectibleObjects.add(new Collectible(BookWyrm.game,j,i,12));
                        break;
                    default:
                        //Catch all for the remaining book types in the game
                        collectibleObjects.add(new Collectible(BookWyrm.game,j,i,jsonData.layers[2].data[tiles]));
                        break;
                }
            }
            tiles++;
        }
    }

    //Set the camera to follow the player vertically
    BookWyrm.game.physics.startSystem(Phaser.Physics.ARCADE);
    BookWyrm.game.camera.bounds = new Phaser.Rectangle(0,0,750, map.heightInPixels);
    BookWyrm.game.camera.follow(player);

    text1 = BookWyrm.game.add.text(20, 1254, "Books Found: ", { font: "25px Arial Black", fill: "#0f0cf2" });
    text1.stroke = "#1b85e8";
    text1.strokeThickness = 16;
    //  Apply the shadow to the Stroke only
    text1.setShadow(2, 2, "#333333", 2, true, false);
    text1.fixedToCamera = true;

    // Create a label to use as a button
    pause_label = BookWyrm.game.add.sprite(w - 100, 7, 'pause');
    pause_label.fixedToCamera = true;
    pause_label.inputEnabled = true;
    pause_label.events.onInputUp.add(function () {
        // When the paus button is pressed, we pause the game
        BookWyrm.game.paused = true;

        pback = BookWyrm.game.add.sprite(BookWyrm.game.camera.x-5, BookWyrm.game.camera.height/2-350 + BookWyrm.game.camera.y, 'pMenu')

        // Create a label to use as a button
        menu_label = BookWyrm.game.add.sprite(BookWyrm.game.camera.width/2-135 + BookWyrm.game.camera.x, BookWyrm.game.camera.height/2-150 + BookWyrm.game.camera.y, 'menu');
        // menu_label.stroke = "#1b85e8";
        // menu_label.strokeThickness = 16;
        // //  Apply the shadow to the Stroke only
        // menu_label.setShadow(2, 2, "#333333", 2, true, false);
        menu_label.fixedToCamera = true;
        menu_label.inputEnabled = true;

        restart_label = BookWyrm.game.add.sprite(BookWyrm.game.camera.width/2-220 + BookWyrm.game.camera.x, BookWyrm.game.camera.height/2+30 + BookWyrm.game.camera.y, 'restart');
        // restart_label.stroke = "#1b85e8";
        // restart_label.strokeThickness = 16;
        // //  Apply the shadow to the Stroke only
        // restart_label.setShadow(2, 2, "#333333", 2, true, false);
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
            var x1 = BookWyrm.game.camera.width/2-135, x2 = BookWyrm.game.camera.width/2+150;
            var y1 = BookWyrm.game.camera.height/2-150, y2 = BookWyrm.game.camera.height/2-50+62;

            var x3 = BookWyrm.game.camera.width/2-220, x4 = BookWyrm.game.camera.width/2+210;
            var y3 = BookWyrm.game.camera.height/2+30, y4 = BookWyrm.game.camera.height/2+30+120;

            // Check if the click was inside the menu
            if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
                BookWyrm.menuSound.play("", 0, 1, false, true);
                BookWyrm.game.paused = false;
                 BookWyrm.game.camera.fade(0x000000,500, true);
                BookWyrm.game.camera.onFadeComplete.add( function() {BookWyrm.game.state.start('Title')}, this);
            }
            else if(event.x > x3 && event.x < x4 && event.y > y3 && event.y < y4 ){
                BookWyrm.menuSound.play("", 0, 1, false, true);
                BookWyrm.game.paused = false;
                booksFound = 0;
                BookWyrm.game.camera.fade(0x000000,500, true);
                BookWyrm.game.camera.onFadeComplete.add( function() {BookWyrm.game.state.start('Game')}, this);
            }
            else{
                // Remove the menu and the label
                pback.destroy();
                menu_label.destroy();
                choiseLabel.destroy();
                restart_label.destroy();
                BookWyrm.menuSound.play("", 0, 1, false, true);
                // Unpause the game
                BookWyrm.game.paused = false;
            }
        }
    };

    BookWyrm.game.camera.flash(0x000000, 1000);
}

function update()
{

    if(!BookWyrm.music.isPlaying)
    {
        console.log("")
        BookWyrm.music = BookWyrm.game.add.audio('game', 0, 1, true);
        BookWyrm.music.play('', 0, 1, true);
    }

    border.x = BookWyrm.game.camera.x;
    border.y = BookWyrm.game.camera.y;
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


/*
* Handle movement for all player controlled actors, move 1 tile every movementspeed milliseconds
*
* @param unit The unit that will be moved
*
*/

function movementHelper(unit){
    if (unit.xPos !== unit.xDest && (unit.xPos * 120 + 15) == unit.x && unit.yPos * 120 == unit.y)
    {

        if(unit.xPos < unit.xDest && checkLocation(unit.xPos, unit.yPos, unit.xPos+1, unit.yPos))
        { 
            unit.xPos++;
            unit.animations.play("right"); 
        } 
        else if (unit.xPos < unit.xDest && grid[unit.yPos][unit.xPos+1] === 1)
        {
            unit.xDest = unit.xPos;
        }

        if(unit.xPos > unit.xDest && checkLocation(unit.xPos, unit.yPos, unit.xPos-1, unit.yPos))
        {
            unit.xPos--;
            unit.animations.play("left"); 
        } 
        else if (unit.xPos > unit.xDest && grid[unit.yPos][unit.xPos-1] === 1)
        {
            unit.xDest = unit.xPos;
        }

        smoothMovement(unit, unit.movementSpeed);
    } 

    if (unit.yPos !== unit.yDest && unit.yPos * 120 == unit.y && (unit.xPos * 120 + 15) == unit.x)
    {
        if(unit.yPos < unit.yDest && checkLocation(unit.xPos, unit.yPos, unit.xPos, unit.yPos+1))
        {
            unit.animations.play("down");  
            unit.yPos++;
        } 
        else if (unit.yPos < unit.yDest && grid[unit.yPos+1][unit.xPos] === 1)
        {
            unit.yDest = unit.yPos;
        }

        if(unit.yPos > unit.yDest && checkLocation(unit.xPos, unit.yPos, unit.xPos, unit.yPos-1))
        {
            unit.animations.play("up");  
            unit.yPos--;
        } 
        else if (unit.yPos > unit.yDest && grid[unit.yPos-1][unit.xPos] === 1)
        {
            unit.yDest = unit.yPos;
        }

        smoothMovement(unit, unit.movementSpeed);
    }
}

/*
* Reload the current scene, this is used for reloading to get a new map, on defeat, on reset
*/

function reloadScene()
{
    booksFound = 0;
    BookWyrm.game.state.start(BookWyrm.game.state.current);
}