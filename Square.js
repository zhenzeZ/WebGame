/**
 * 
 * @param {Number} x assumed numeric value for position X
 * @param {Number} y assumed numeric value for position Y
 * @param {Number} width assumed numeric value for square width
 * @param {Number} height assumed numeric value for square height
 * @param {String} colour a string of the color
 */
function Square(x,y,width, height, colour)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.colour = colour;
}

/**
 * draw the square to canvas
 * @param {Canvas} ctx the element canvas 
 */
Square.prototype.drawFill = function(ctx)
{
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x,this.y,this.width,this.height);
    ctx.stroke();
    //console.log("DRAW SQUARE!");
}

/**
 * draw the square to canvas
 * @param {Canvas} ctx the element canvas 
 */
Square.prototype.drawHollow = function(ctx)
{
    ctx.beginPath();
    ctx.lineWidth = "10";
    ctx.strokeStyle = this.colour;
    ctx.strokeRect(this.x,this.y,this.width,this.height);
    ctx.stroke(); 
    //console.log("DRAW SQUARE!");
}

Square.prototype.move = function(x,y)
{
    this.x = x;
    this.y = y;
}
