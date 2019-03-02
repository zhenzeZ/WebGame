/**
 * Menu scene which is inherited from scene class
 */
class MenuScene extends Scene
{   
    /**
    * constructor using keyword super to inherit from Scene class
    * @param {string} title string title for name
    * @param {string} colour string colour for colour of scene
    */
    constructor(title,colour, game, ws)
    {
        super(title,colour);
        this.ws = ws;
        this.game = game;
        this.width = 400;
        this.height = 100;
        this.posPlay = {x:300,y:100};
        this.posMultiple = {x:300,y:300}
        this.posOptions = {x:300,y:500};
        this.posQuit = {x:300,y:700};
        document.addEventListener("touchstart",this.onTouchStart.bind(null, this.game,this, this.ws), {once: true});
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
        ctx.strokeRect(this.posPlay.x, this.posPlay.y, this.width, this.height);
        ctx.fillText("Play", 450,170);
        ctx.strokeRect(this.posMultiple.x,this.posMultiple.y,this.width,this.height);
        ctx.fillText("multiplayer", 410,370);
        ctx.strokeRect(this.posOptions.x,this.posOptions.y,this.width,this.height);
        ctx.fillText("Options", 410,570);
        ctx.strokeRect(this.posQuit.x,this.posQuit.y,this.width,this.height);
        ctx.fillText("Quit", 450,770);

    }
    
    onTouchStart(game,menu,ws, e)
    {
        var touches = e.touches;
    
        var startX = touches[0].clientX;
        var startY = touches[0].clientY;
    
        var startPosX = startX;
        var startPosY = startY;
        console.log(startPosX , " " , startPosY);
        if(menu.checkCollisionPlay(startPosX,startPosY))
        {
            console.log("play button clicked");
            game.sceneManager.goToScene("Playing Scene");  
            //game.sceneManager.render(game.ctx);

        }
        else if(menu.checkCollisionMultiplayer(startPosX,startPosY))
        {
            // send join message
            var message = {}
            message.type = "join";
            message = JSON.stringify(message);
            console.log(message);
            ws.send(message);

            console.log("play button clicked");
            game.sceneManager.goToScene("Multiplay Scene");  
            //game.sceneManager.render(game.ctx);

        }
        else if(menu.checkCollisionOptions(startPosX,startPosY))
        {
            console.log("options button clicked");
            game.sceneManager.goToScene("Options");  
            game.sceneManager.render(game.ctx);

        }
        else if(menu.checkCollisionQuit(startPosX,startPosY))
        {
            console.log("quit button clicked");
            game.sceneManager.goToScene("Quit");  
            game.sceneManager.render(game.ctx);
        }


        
    }
    checkCollisionPlay(clickX,clickY)
    {
        if((clickX < this.posPlay.x + this.width) &&
        (clickX+ this.width > this.posPlay.x) &&
        (clickY+ this.height > this.posPlay.y) &&
        (clickY < this.posPlay.y + this.height))
    {
        return true;
    }
        return false;
    }

    checkCollisionMultiplayer(clickX,clickY)
    {
        if((clickX < this.posMultiple.x + this.width) &&
        (clickX+ this.width > this.posMultiple.x) &&
        (clickY+ this.height > this.posMultiple.y) &&
        (clickY < this.posMultiple.y + this.height))
    {
        return true;
    }
        return false;
    }

    checkCollisionOptions(clickX,clickY)
    {
        if((clickX < this.posOptions.x + this.width) &&
        (clickX+ this.width > this.posOptions.x) &&
        (clickY+ this.height > this.posOptions.y) &&
        (clickY < this.posOptions.y + this.height))
    {
        return true;
    }
        return false;
    }
    
    checkCollisionQuit(clickX,clickY)
    {
        if((clickX < this.posQuit.x + this.width) &&
        (clickX+ this.width > this.posQuit.x) &&
        (clickY+ this.height > this.posQuit.y) &&
        (clickY < this.posQuit.y + this.height))
    {
        return true;
    }
        return false;
    }

    update()
    {
        
    }
}