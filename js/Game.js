var BookWyrm = BookWyrm || {};

BookWyrm.Game = function(){};
 
 //Main Gameplay State
BookWyrm.Game.prototype = {
    create:create,
    update:update    
};

//List of all carts in the state, useful for collsion and determining
//if the object can be be dragged around the game
var carts;
var movingGameObject = null;

var startX;
var startY;
var endX;
var endY;


function create()
{
    BookWyrm.game.physics.startSystem(Phaser.Physics.ARCADE);
    carts = BookWyrm.game.add.group();
    carts.add(new Cart(BookWyrm.game, 600, 120))
    carts.add(new Cart(BookWyrm.game, 0, 0))
}

function update()
{
    this.physics.arcade.collide(carts, carts);
}

function onClick (obj, pointer)
{
    console.log("onClick");
    startX = BookWyrm.game.input.worldX;
    startY = BookWyrm.game.input.worldY;

    //Will Also inlude the player character
    if(carts.contains(obj))
    {
        movingGameObject = obj;
        console.log(movingGameObject.x)
        BookWyrm.game.input.onUp.add(endSwipe, this);  
    }
}

function endSwipe(obj, pointer){
    console.log("endSwipe " + startX + " " + startY);
    endX = BookWyrm.game.input.worldX;
    endY = BookWyrm.game.input.worldY;

    var distX = startX-endX;
    var distY = startY-endY;

    if(Math.abs(distX)>Math.abs(distY)*2 && Math.abs(distX) > 80){
        if(distX>0){
            movingGameObject.x -= 120;
        }
        else
        {
            movingGameObject.x += 120;
        }
    }

    if(Math.abs(distY)>Math.abs(distX)*2 && Math.abs(distY) > 80){
        if(distY>0)
        {
            movingGameObject.y -= 120;
        }
        else
        {
            movingGameObject.y += 120;
        }
    }

    BookWyrm.game.input.onUp.remove(endSwipe, this);
}