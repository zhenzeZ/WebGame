class Obstacle
{
    constructor(plantform)
    {
        this.x = plantform.x;
        this.y = plantform.y;
        this.width = plantform.width;
        this.height = plantform.height;

        // Create the square
        this.square = new Square(this.x,this.y,this.width,this.height,'rgb(0, 0, 0)');
    }

    /**
     * render the square
     * @param {object} ctx 
     */
    render(ctx)
    {
        this.square.move(this.x, this.y);
        this.square.drawFill(ctx);
    }
}