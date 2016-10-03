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

var grid = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

function create()
{
    BookWyrm.game.physics.startSystem(Phaser.Physics.ARCADE);
    collectibleObjects = BookWyrm.game.add.group();
    collectibleObjects.add(new Collectible(BookWyrm.game, 4, 2));

    interactableObjects = BookWyrm.game.add.group();
    interactableObjects.add(new Cart(BookWyrm.game, 5, 1, 1));
    interactableObjects.add(new Cart(BookWyrm.game, 0, 0, 0));
    interactableObjects.add(new Cart(BookWyrm.game, 3, 3 , 0));
    interactableObjects.add(new Chair(BookWyrm.game, 2, 1));
    interactableObjects.add(new Chair(BookWyrm.game, 2, 2));
    interactableObjects.add(new Chair(BookWyrm.game, 0, 2));
    interactableObjects.add(player = new Player(BookWyrm.game, 5, 5));

    //console.table(grid); //Debug tool, shows the grid in the console
}

function update()
{
    this.physics.arcade.collide(interactableObjects, interactableObjects); //I dont think this is needed as all interactables should never touch do to grid movement, but its nice to have just incase
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
        console.table(grid); //Debug tool, shows the grid in the console
        return true;
    }
    else
    {
        return false
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
  BookWyrm.game.add.tween(unit).to( { x: unit.xPos * 120, y: unit.yPos * 120 }, time, Phaser.Easing.linear, true);
}