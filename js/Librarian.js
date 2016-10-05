/*
* Basic enemy unit, attempt to chase the player
*
* @param game The current Phaser Game instance
* @param x The x location of the unit
* @param y The y location of the unit
*
*/

Librarian = function (game, x, y) {
    Phaser.Sprite.call(this, game, x*120, y*120, 'librarian');
    //Enable input and physics
    this.inputEnabled = true;
    this.events.onInputDown.add(onClickCollectible, this); 
    BookWyrm.game.physics.enable(this);

    //Used for keeping track of the location in the grid
    this.xPos = x;
    this.yPos = y;

    this.movementSpeed = 1500;

    //These are reversed as it makes the array much more user friendly for level building and debugging
    grid[y][x] = 1;
};

Librarian.prototype = Object.create(Phaser.Sprite.prototype);
Librarian.prototype.constructor = Librarian;

Librarian.prototype.update = function()
{


    if(this.yPos * 120 === this.y && this.xPos * 120 === this.x)
    {

        if(Phaser.Math.distance(this.x +60, this.y + 60, player.x+60,player.y+60) < 130)
        {
            BookWyrm.game.camera.fade(0x000000,500);
            BookWyrm.game.camera.onFadeComplete.add(reloadScene, this);
        }

        var currentPath = [];
        grid[player.yPos][player.xPos] = 0;
        currentPath = this.findPath(grid,[this.xPos,this.yPos],[player.xPos,player.yPos]);
        grid[player.yPos][player.xPos] = 1;
        if(currentPath.length > 1 && checkLocation(this.xPos, this.yPos, currentPath[1][0], currentPath[1][1]))
        {
            this.xPos = currentPath[1][0];
            this.yPos = currentPath[1][1];
            smoothMovement(this, this.movementSpeed);
        }
    }
}

Librarian.prototype.findPath = function (world, pathStart, pathEnd)
{
    var worldWidth = world[0].length;
    var worldHeight = world.length;
    var worldSize = worldWidth * worldHeight;

    var distanceFunction = function (Point, Goal)
    {  
        return Math.abs(Point.x - Goal.x) + Math.abs(Point.y - Goal.y);
    }


    function Neighbours(x, y)
    {
        var N = y - 1,
        S = y + 1,
        E = x + 1,
        W = x - 1,
        myN = N > -1 && canWalkHere(x, N),
        myS = S < worldHeight && canWalkHere(x, S),
        myE = E < worldWidth && canWalkHere(E, y),
        myW = W > -1 && canWalkHere(W, y),
        result = [];
        if(myN)
        result.push({x:x, y:N});
        if(myE)
        result.push({x:E, y:y});
        if(myS)
        result.push({x:x, y:S});
        if(myW)
        result.push({x:W, y:y});
        return result;
    }

    //Determine if a node is availabe for movement
    function canWalkHere(x, y)
    {
        return ((world[y] !== null) &&
            (world[y][x] !== null) &&
            (world[y][x] === 0));
    };

    //Node object used for AStar
    function Node(Parent, Point)
    {
        var newNode = {
            //Previous node in the optimal path to this node
            Parent:Parent,
            //Array Value in AStar array
            value:Point.x + (Point.y * worldWidth),
            //Location
            x:Point.x,
            y:Point.y,
            //Estimated cost
            f:0,
            //Distance
            g:0
        };

        return newNode;
    }

    //Path function, executes AStar algorithm operations
    function calculatePath()
    {
        //Nodes for the start and ending points
        var mypathStart = Node(null, {x:pathStart[0], y:pathStart[1]});
        var mypathEnd = Node(null, {x:pathEnd[0], y:pathEnd[1]});
        
        //Array used to track all nodes
        var AStar = new Array(worldSize);
        //List of nodes that have not been calculated
        var Open = [mypathStart];
        // Final path to be output by A*
        var result = [];

        //All available nearby nodes
        var myNeighbours;
        var myNode;
        var myPath;

        //Iterate through all nodes in the Open array
        var length, max, min, i, j;
        while(length = Open.length)
        {
            max = worldSize;
            min = -1;
            for(i = 0; i < length; i++)
            {
                if(Open[i].f < max)
                {
                    max = Open[i].f;
                    min = i;
                }
            }
            //Pop a value from the start of the array
            myNode = Open.splice(min, 1)[0];
            
            //Determine if the end of the path has been found
            if(myNode.value === mypathEnd.value)
            {
                myPath = myNode;
                do
                {
                    result.push([myPath.x, myPath.y]);
                }
                while (myPath = myPath.Parent);
                AStar = Open = [];
                result.reverse();
            }
            else
            {
                //Add all adjacent nodes to the list of available nodes
                myNeighbours = Neighbours(myNode.x, myNode.y);
                
                for(i = 0, j = myNeighbours.length; i < j; i++)
                {
                    myPath = Node(myNode, myNeighbours[i]);
                    //Only check if the value has not been closed
                    if (!AStar[myPath.value])
                    {
                        //Add the cost values for the current path
                        myPath.g = myNode.g + distanceFunction(myNeighbours[i], myNode);
                        myPath.f = myPath.g + distanceFunction(myNeighbours[i], mypathEnd);
                        
                        //Add this path to the array of possible paths toexplore
                        Open.push(myPath);

                        //Close this node for reuse
                        AStar[myPath.value] = true;
                    }
                }
            }
        } 
        return result;
    }

    // actually calculate the a-star path!
    // this returns an array of coordinates
    // that is empty if no path is possible
    return calculatePath();
}

