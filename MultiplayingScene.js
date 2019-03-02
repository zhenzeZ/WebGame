/**
 * Playing scene which is inherited from scene class
 */
class Multiplaying extends Scene
{
    /**
     * constructor using keyword super to inherit from Scene class
     * @param {string} title string title for name
     * @param {string} colour string colour for colour of scene
     */
    constructor(title,colour,game,ws)
    {
        super(title,colour);
        this.ws = ws;
        this.ctx = {};
        this.game = game;
        this.request = new XMLHttpRequest();
        this.requestPlayer = new XMLHttpRequest();
        this.image1 = new Image();
        this.image1.src = "Images/spriteSheet.png";
        this.jsonAddress = "http://149.153.106.114:8000/Plantform.json";

        this.level = 1;

        this.previousTime = 0;
        this.obstacle = []; // Javascript list!
        this.player1 = {};
        this.player2 = {};
        this.player1Bullet = [];
        this.player2Bullet = [];

        this.playerNum;
        this.gun2 = {};
        // audio play
        this.context = new AudioContext();
        this.sound ;

        // data send to another player
        this.playerData = {};
        this.bulletData = {};
        this.gunData = {};
        this.gunRespawn = {}

        this.initWorld();
    }

    initWorld()
    {
        // set the type of the sending data
        this.playerData.type = "updateState";
        this.playerData.dataType = "player";

        this.bulletData.type = "updateState";
        this.bulletData.dataType = "bullet";

        this.gunData.type = "updateState";
        this.gunData.dataType = "gun";

        this.gunRespawn.type = "updateState";
        this.gunRespawn.dataType = "gunRespawn";

        this.gun = new Gun(this.ctx, {
            width: 44,
            height: 44,
            image: this.image1 },
            300,
            0,
            -44);

        this.gun2 = new Gun(this.ctx, {
            width: 44,
            height: 44,
            image: this.image1 },
            300,
            0,
            -100);

        // Use the document object to create a new element canvas.
        var canvas = document.createElement("canvas");
        // Assign the canvas an id so we can reference it elsewhere.
        canvas.id = 'mycanvas';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        this.ctx = canvas.getContext("2d");
        document.body.appendChild(canvas);

        // create the player
        this.player1 = new Player({"x": 500, "y": 0});
        this.player2 = new Player2({"x": 500, "y": 0});
        
                
        //var request = new XMLHttpRequest();
        var that = this;

        this.ws.onmessage = function (evt) {
            var obj = JSON.parse(evt.data);
            console.log(obj)
            switch (obj.type) {
                case "message":
                    alert(obj.data)
                    break;
                case "player":
                    switch (obj.data) {
                        case "1":
                            that.playerNum = 1;
                            console.log("player1")
                            that.requestPlayer.open("GET", that.jsonAddress);
                            that.requestPlayer.send();
                            break;
                        case "2":
                            that.playerNum = 2;
                            console.log("player2")
                            that.requestPlayer.open("GET", that.jsonAddress);
                            that.requestPlayer.send();
                            break;
                        default:
                            break;
                    }
                    break;
                case "updateState":
                    switch (obj.dataType) {
                        case "player":
                            that.player2.getStates(obj.data.x, obj.data.y, obj.data.velocity, obj.data.movement);
                            break;
                        case "bullet":
                        that.player2Bullet.push(new Bullet(obj.data.x
                            , obj.data.y
                            , obj.data.radians
                            , "blue"));
                            if(that.player2.ammo > 0)
                            {
                                that.playSound(that.sound["shot2"]);
                            }
                            else if (that.player2.ammo <= 0)
                            {
                                that.playSound(that.sound["empty2"]);
                            }
                            break;
                        case "gun":
                        if (that.gun2 != undefined)
                            that.gun2.getStates(obj.data.x, obj.data.y);
                            break;
                        case "gunRespawn":
                            that.gun.respawn();
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        };

        this.requestPlayer.addEventListener("load", function requestListener(){
            var json = JSON.parse(this.responseText);
            if (that.playerNum == 1)
                    {
                        that.player1.resetPlayer(json.player);
                        that.player2.resetEnemy(json.enemy);
                    }
                    else if (that.playerNum == 2)
                    {
                        that.player1.resetPlayer(json.enemy);
                        that.player2.resetEnemy(json.player);
                    }
        });
        

        this.request.addEventListener("load", function requestListener(){
            //TADA! Now I have the class data.
            var json = JSON.parse(this.responseText);
                    
            if( that.sound == undefined)
            {
                that.sound = json.sound;
                var len = that.sound.length, i;
                    
                for (i in that.sound) 
                {
                    if (that.sound.hasOwnProperty(i)) 
                    {
                        // load sound
                        that.loadSound(that.sound[i], that);
                    }
                }
            }   
        
            // set plantform, player1 and player2 position
            switch (that.level) {
                case 1:
                    for (var i = 0; i < json.level1.length; i++)
                    {
                        that.obstacle.push(new Obstacle(json.level1[i]));
                    }
                    break;
                case 2:
                    for (var i = 0; i < json.level2.length; i++)
                    {
                        that.obstacle.push(new Obstacle(json.level2[i]));
                    }
                    break;
                case 3:
                    for (var i = 0; i < json.level3.length; i++)
                    {
                        that.obstacle.push(new Obstacle(json.level3[i]));
                    }
                    break;
                default:
                break;
            }
                    
        });
                
        //request.open("GET", "https://github.com/ITCGamesProg2/gd-gpp-project-gd-gpp-project-patryk-zhenze/blob/master/Plantform.json");
        this.request.open("GET", this.jsonAddress);
        this.request.send();

        window.addEventListener('touchstart', this.onTouchStart.bind(null, this.player1));
        window.addEventListener('touchmove', this.onTouchMove.bind(null, this.player1));
        window.addEventListener('touchend', this.onTouchEnd.bind(null, this.player1));
                

        this.ps = new ParticleSystem(this.player2.x, this.player2.y);
        this.psplayer = new ParticleSystem(this.player1.x, this.player1.y);
    }

    loadSound(sound,that) {
        var request = new XMLHttpRequest();
        request.open('GET', sound.src, true);
        request.responseType = 'arraybuffer';
    
        request.onload = function() {
            // request.response is encoded... so decode it now
            that.context.decodeAudioData(request.response, function(buffer) {
                sound.buffer = buffer;
            }, 
            function(e) {
                // audio not supported
                throw new Error('Web Audio API not supported.');
            });
        }
        request.send();
    }
     /**
     * Play a sound
     * @param {Object} buffer AudioBuffer object - a loaded sound.
     */

    playSound(sound) {
        var source = this.context.createBufferSource();

        // load the buffer
        source.buffer = sound.buffer;

        // loop the audio
        source.loop = sound.loop;

        // create a gain node
        sound.gainNode = this.context.createGain();
        
        // connect the source to the gain node
        source.connect(sound.gainNode);

        // set the gain (volume)
        sound.gainNode.gain.value = sound.volume;

        // connect gain node to destination
        sound.gainNode.connect(this.context.destination);

        //play sound
        source.start(0);

    }
    /**
     * render the scene 
     * colour of background to changed
     * change font/size/position
     * @param {object} ctx canvas context
     */
    render(ctx)
    {
        this.ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

        //console.log("Render Playing Scene");
        ctx.clearRect(0, 0, window.innerWidth,window.innerHeight);
        document.body.style.background =this.colour;
        ctx.font = '50px Bell MT';
        ctx.fillText(this.title, 50, 50);


        
        for (var i = 0; i < this.obstacle.length; i++)
        {
            this.obstacle[i].render(this.ctx);
        }
        
        this.player1.render(this.ctx);
        this.player2.render(this.ctx);
        
        if(this.gun.alive ===true)
        {
            this.gun.draw(this.ctx);
        }

        this.gun2.draw(this.ctx);
        
        for (var i = 0; i < this.player1Bullet.length; i++)
        {
            this.player1Bullet[i].render(this.ctx);
        }

        for (var i = 0; i < this.player2Bullet.length; i++)
        {
            this.player2Bullet[i].render(this.ctx);
        }

        this.ps.render(this.ctx);
        this.psplayer.render(this.ctx);
    }

    update()
    {
        var now = Date.now();
        var deltaTime = (now - this.previousTime); 
        this.previousTime = now;  

            // check collision with plantform
            for (var i = 0; i < this.obstacle.length; i++)
            {
                if (this.player1.checkCollision(this.obstacle[i]))
                {
                    this.player1.collideWithObstacle(this.obstacle[i]);
                }
                
                if (this.player2.checkCollision(this.obstacle[i]))
                {
                    this.player2.collideWithObstacle(this.obstacle[i]);
                }
                
                if(this.gun.checkCollision(this.obstacle[i]))
                {
                    this.gun.stopFalling();
                }
            }
    
            if (this.player2.checkCollision(this.gun))
            {
                this.playSound(this.sound["reload"]);
                this.sound["reload"].play = true;
    
                this.gun.respawn();
                this.player2.collectAmmo();
                //console.log("player2 got it");
            }
    
            if (this.player1.checkCollision(this.gun))
            {
                this.playSound(this.sound["reload"]);
                this.sound["reload"].play = true;
    
                this.gun.respawn();
                this.player1.collectAmmo();
                //console.log("player got it");
            }

            if (this.player2.checkCollision(this.gun2))
            {
                this.playSound(this.sound["reload"]);
                this.sound["reload"].play = true;
    
                this.ws.send(JSON.stringify(this.gunRespawn));
                this.player2.collectAmmo();
                //console.log("player2 got it");
            }
    
            if (this.player1.checkCollision(this.gun2))
            {
                this.playSound(this.sound["reload"]);
                this.sound["reload"].play = true;
    
                this.ws.send(JSON.stringify(this.gunRespawn));
                this.player1.collectAmmo();
                //console.log("player got it");
            }
    
            for (var i = 0; i < this.player1Bullet.length; i++)
            {
    
                if (this.player2.checkCollision(this.player1Bullet[i]))
                {
                    this.player1Bullet.splice(i,1);
                    this.player2.loseHealth();
                    this.psplayer.init(this.player2.x,this.player2.y);
                    //console.log("player2 get hit");
                }
            }
    
            for (var i = 0; i < this.player2Bullet.length; i++)
            {
                if (this.player1.checkCollision(this.player2Bullet[i]))
                {
                    this.player2Bullet.splice(i,1);
                    this.player1.loseHealth();
                    this.ps.init(this.player1.x,this.player1.y);
                    //console.log("player get hit");
                }
            }
    
            if (this.player1.checkGameover())
            {
                this.game.sceneManager.goToScene("Game Over Scene");  
                this.game.sceneManager.render(this.game.ctx);
                // to game over screen
                console.log("gameover");
            }

            if (this.player2.checkGameover())
            {
                this.game.sceneManager.goToScene("Game Over Scene");  
                this.game.sceneManager.render(this.game.ctx);
                // to game over screen
                console.log("gameover");
            }
    
            // move to next level when player2's health is 0
            if (this.player2.checkGameover())
            {
                var gameoverMessage = {};
                gameoverMessage.type = "gameover"
                //console.log(gameoverMessage)
             this.ws.send(JSON.stringify(gameoverMessage))
            }
    
            // play sound effect
            if (this.sound != undefined)
            {
                // play the shot sound and create bullet object
                // check the ammo and create bullet object
                if(this.player1.shot() && !this.sound["shot"].play && this.player1.ammo > 0)
                {
                    this.playSound(this.sound["shot"]);
                    this.sound["shot"].play = true;
    
                    this.player1Bullet.push(new Bullet(this.player1.x + this.player1.width / 2
                                            , this.player1.y + this.player1.height / 2
                                            , this.player1.radians
                                            , "red"));

                    this.bulletData.data = {"x" : this.player1.x + this.player1.width / 2, "y" : this.player1.y + this.player1.height / 2, "radians" : this.player1.radians};
                    this.ws.send(JSON.stringify(this.bulletData));
                }
                else if (this.player1.shot() && !this.sound["empty"].play && this.player1.ammo <= 0)
                {
                    this.playSound(this.sound["empty"]);
                    this.sound["empty"].play = true;
                }
                else if (!this.player1.shot())
                {
                    
                    this.sound["shot"].play = false;
                    this.sound["empty"].play = false;
                }
    
                // play the shot sound and create bullet object
                // check the ammo and create bullet object
                /*if(this.player2.shot() && !this.sound["shot2"].play && this.player2.ammo > 0)
                {
                    this.playSound(this.sound["shot2"]);
                    this.sound["shot2"].play = true;
                }
                else if (this.player2.shot() && !this.sound["empty2"].play && this.player2.ammo <= 0)
                {
                    this.playSound(this.sound["empty2"]);
                    this.sound["empty2"].play = true;
                }
                else if (!this.player2.shot())
                {
                    
                    this.sound["shot2"].play = false;
                    this.sound["empty2"].play = false;
                }
                */
                if (!this.sound["background"].play)
                {
                    this.playSound(this.sound["background"]);
                    this.sound["background"].play = true;
                }
            }
    
            // update
            for (var i = 0; i < this.player1Bullet.length; i++)
            {
                this.player1Bullet[i].update(deltaTime);
                if (!this.player1Bullet[i].checkAlive())
                {
                    this.player1Bullet.splice(i,1);
                }
            }
    
            for (var i = 0; i < this.player2Bullet.length; i++)
            {
                this.player2Bullet[i].update(deltaTime);
                if (!this.player2Bullet[i].checkAlive())
                {
                    this.player2Bullet.splice(i,1);
                }
            }
    
            this.player1.update(deltaTime);
            this.player2.update(deltaTime);
            this.gun.update(deltaTime);
            this.gun2.animation(deltaTime);
            this.sendingData();
            this.ps.update();
            this.psplayer.update();
    }

    sendingData()
    {
        this.playerData.data = {"x" : this.player1.x, "y" : this.player1.y, "velocity" : this.player1.velocity, "movement" : this.player1.movement};
        this.gunData.data = {"x" : this.gun.x, "y" : this.gun.y};
        
        //console.log(JSON.stringify(this.playerData));
        
        this.ws.send(JSON.stringify(this.playerData));
        this.ws.send(JSON.stringify(this.gunData));
    }

    levelSwitch()
    {
        this.level++;

        if (this.level > 3)
        {
            this.level = 1;
        }
        this.obstacle = [];
        this.bullet = [];
        this.request.open("GET", this.jsonAddress);
        this.request.send();
        this.requestPlayer.open("GET", this.jsonAddress);
        this.requestPlayer.send();
    }

    /**
     * clear the canvas and get the position 
     * @param {Object} ctx the element canvas
     */
    onTouchStart(player, e)
    {
        player.getPosition(e.touches);
    }

    /**
     * draw a line after mouse move
     * @param {Object} ctx the element canvas
     */
    onTouchMove(player, e)
    {
        player.getPosition(e.changedTouches);
    }

    /**
     * detect the swipe
     * check the touch is invalid
     * check the length of the line and how long it take
     * @param {Object} ctx the element canvas
     */
    onTouchEnd(player, e)
    {
        player.resetTouchPosition();
    }
}