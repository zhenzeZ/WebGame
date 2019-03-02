/**
 * Gameover scene which is inherited from scene class
 */
class GameoverScene extends Scene
{
    /**
    * constructor using keyword super to inherit from Scene class
    * @param {string} title string title for name
    * @param {string} colour string colour for colour of scene
    */
    constructor(title,colour, game)
    {
        super(title,colour);
        this.game = game;
        this.x = 300;
        this.width = 400;
        this.height = 100;
        this.posPlayAgain = {x:this.x, y:100};
        this.posQuit = {x:this.x, y:300};

        //document.addEventListener("touchstart",this.onTouchStart.bind(null, this.game,this), {once: true});

    }

    /**
     * render the scene 
     * colour of background to green
     * change font/size/position
     * @param {object} ctx canvas context
     */
    render(ctx)
    {
        console.log("Render Gameover Scene");
        ctx.clearRect(0, 0, window.innerWidth,window.innerHeight);
        document.body.style.background =this.colour;
        ctx.font = '55px helvetica';
        ctx.fillText(this.title, 100, 50);
        ctx.strokeRect(this.posPlayAgain.x,this.posPlayAgain.y,this.width,this.height);
        ctx.fillText("Play Again?", 370,170);
        ctx.strokeRect(this.posQuit.x,this.posQuit.y,this.width,this.height);
        ctx.fillText("Quit", 450,370);
    
    }

    onTouchStart(game,menu, e)
    {
        console.log("back to menu");
        game.sceneManager.goToScene("Menu Scene");  
        game.sceneManager.render(game.ctx);
    }

    update()
    {

    }

}