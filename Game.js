var gamee = {}

class Game
{
    /**
     * add the scene to SceneManager
     * render the scene 
     */
    constructor()
    {
        this.ws = new WebSocket("ws://149.153.106.114:8080/wstest");
        this.ctx = {};
        
        this.boundRecursiveUpdate = this.update.bind(this);
        this.boundDraw = this.draw.bind(this);

       
        this.initWorld();
        this.sceneManager = new SceneManager();
        this.menuScene = new MenuScene("Menu Scene","blue", this, this.ws);
        this.playingScene = new PlayingScene("Playing Scene","white", this);
        this.multiplayScene = new Multiplaying("Multiplay Scene", "white", this, this.ws);
        this.gameoverScene = new GameoverScene("Game Over Scene","yellow", this);
        this.nextlevelScene = new NextLevelScene("Next level","purple");
        this.optionsScene = new OptionScene("Options","grey");
    
        this.sceneManager.addScene(this.menuScene);
        this.sceneManager.addScene(this.playingScene);
        this.sceneManager.addScene(this.multiplayScene);
        this.sceneManager.addScene(this.gameoverScene);
        this.sceneManager.addScene(this.nextlevelScene);
        this.sceneManager.addScene(this.optionsScene);

        this.sceneManager.goToScene(this.menuScene.title);
        this.sceneManager.render(this.ctx);

    }

    /**
     * initialise the canvas
     */
    initWorld()
    {
        // Use the document object to create a new element canvas.
        var canvas = document.createElement("canvas");
        // Assign the canvas an id so we can reference it elsewhere.
        canvas.id = 'mycanvas';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this.ctx = canvas.getContext("2d");
        document.body.appendChild(canvas);

        console.log("Initialising game world");
        


        // iterate over sounds obj

        
            /*var len = this.sound.length, i;
            
            for (i in this.sound) {
                if (this.sound.hasOwnProperty(i)) {
                    // load sound
                    this.loadSound(this.sound[i], that);
                }
            }*/
        

        //this.loadSound("http://127.0.0.1:8887/Audio/Music.mp3", that);
        //this.playSound(this.sound);

    }

    
   

   
    // playSound(sound);

    /**
     * the timed loop for game.update
     */
    update()
    {

        var now = Date.now();
        var deltaTime = (now - this.previousTime); 
        this.previousTime = now;  
        
        this.sceneManager.update();
        console.log(this.sceneManager.title);
        
        this.boundDraw();
        window.requestAnimationFrame(this.boundRecursiveUpdate);
    }

    /**
     * render the player and goal on window
     */
    draw()
    {
        this.sceneManager.render(this.ctx);
    }

    /**
     * switch level and reload json
     */
    levelSwitch()
    {
        this.level++;
        if (this.level > 4)
        {
            this.level = 1;
        }
        this.obstacle = [];
        this.playerBullet = [];
        this.gun.respawn();
        this.request.open("GET", "http://127.0.0.1:8887/Plantform.json");
        this.request.send();
    }

}