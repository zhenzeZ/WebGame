/**
 * Menu scene which is inherited from scene class
 */
class NextLevelScene extends Scene
{   
    /**
    * constructor using keyword super to inherit from Scene class
    * @param {string} title string title for name
    * @param {string} colour string colour for colour of scene
    */
    constructor(title,colour)
    {
        super(title,colour);
        this.x = 300;
        this.width = 400;
        this.height = 100;
        this.nextLevel = {x:this.x, y:100};

    }
    
    /**
     * render the scene 
     * colour of background to changed
     * change font/size/position
     * @param {object} ctx canvas context
     */
    render(ctx)
    {
        console.log("Render Menu Scene");
        ctx.clearRect(0, 0, window.innerWidth,window.innerHeight);
        document.body.style.background =this.colour;
        ctx.font = '50px Arial';
        ctx.fillText(this.title, 0, 50);
        ctx.strokeRect(this.nextLevel.x, this.nextLevel.y, this.width, this.height);
        ctx.fillText("Next Level", 390,170);

    }
}