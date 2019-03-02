/**
 * Playing scene which is inherited from scene class
 */
class PlayingScene extends Scene
{
    /**
     * constructor using keyword super to inherit from Scene class
     * @param {string} title string title for name
     * @param {string} colour string colour for colour of scene
     */
    constructor(title,colour,game)
    {
        super(title,colour);
        this.ctx = {};
        this.game = game;
        this.request = new XMLHttpRequest();
        this.image1 = new Image();
        this.image1.src = "Images/spriteSheet.png";

        this.level = 0;

        this.previousTime = 0;
        this.obstacle = []; // Javascript list!
        this.player = {};
        this.enemy = {};
        this.playerBullet = [];
        this.enemyBullet = [];
        
        // audio play
        this.context = new AudioContext();
        this.sound ;
        this.initWorld();
    }
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
                // create the player
                this.player = new Player({"x": 100, "y": 0});
                this.enemy = new Enemy({"x": 800, "y": 0});
        
                
                //var request = new XMLHttpRequest();
                var that = this;
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
        
                    // set plantform, player and enemy position
                    switch (that.level) {
                        case 0:
                            for (var i = 0; i < json.level0.length; i++)
                            {
                                that.obstacle.push(new Obstacle(json.level0[i]));
                            }
                            that.player.resetPlayer(json.player);
                            //that.enemy.resetEnemy(json.enemy);
                            that.enemy.tutorialPositionEnemy();
                            break;
                        case 1:
                            for (var i = 0; i < json.level1.length; i++)
                            {
                                that.obstacle.push(new Obstacle(json.level1[i]));
                            }
                            that.player.resetPlayer(json.player);
                            that.enemy.resetEnemy(json.enemy);
                            break;
                        case 2:
                            for (var i = 0; i < json.level2.length; i++)
                            {
                                that.obstacle.push(new Obstacle(json.level2[i]));
                            }
                            that.player.resetPlayer(json.player);
                            that.enemy.resetEnemy(json.enemy);
                            break;
                        case 3:
                            for (var i = 0; i < json.level3.length; i++)
                            {
                                that.obstacle.push(new Obstacle(json.level3[i]));
                            }
                            that.player.resetPlayer(json.player);
                            that.enemy.resetEnemy(json.enemy);
                            break;
                        default:
                        break;
                    }
                    
                });
                
                //request.open("GET", "https://github.com/ITCGamesProg2/gd-gpp-project-gd-gpp-project-patryk-zhenze/blob/master/Plantform.json");
                this.request.open("GET", "http://149.153.106.114:8000/Plantform.json");
                this.request.send();
        
                window.addEventListener('touchstart', this.onTouchStart.bind(null, this.player));
                window.addEventListener('touchmove', this.onTouchMove.bind(null, this.player));
                window.addEventListener('touchend', this.onTouchEnd.bind(null, this.player));
                
        this.gun = new Gun(this.ctx, {
            width: 44,
            height: 44,
            image: this.image1 },
            300,
            0,
            -44);
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

        console.log("Render Playing Scene");
        ctx.clearRect(0, 0, window.innerWidth,window.innerHeight);
        document.body.style.background =this.colour;
        ctx.font = '50px Bell MT';
        ctx.fillText(this.title, 50, 50);


       
        
        for (var i = 0; i < this.obstacle.length; i++)
        {
            this.obstacle[i].render(this.ctx);
        }
        
        this.player.render(this.ctx);
        this.enemy.render(this.ctx);
        
        if(this.gun.alive ===true)
        {
            this.gun.draw(this.ctx);
        }
        
        for (var i = 0; i < this.playerBullet.length; i++)
        {
            this.playerBullet[i].render(this.ctx);
        }

        for (var i = 0; i < this.enemyBullet.length; i++)
        {
            this.enemyBullet[i].render(this.ctx);
        }

        if (this.level === 0)
        {
            this.tutorialMessage();
        }
    }

    tutorialMessage()
    {
        this.ctx.save();
            this.ctx.fillStyle = 'rgb(255, 0, 0)';
            this.ctx.font = 'italic 24pt Calibri';
            this.ctx.textBaseline = "top";
            this.ctx.fillText("left stick for movement", 200, window.innerHeight / 5 * 4);
            this.ctx.fillText("right stick for shoot", window.innerWidth - 200, window.innerHeight / 5 * 4);
            this.ctx.fillText("when the green bar on player head reduce to 0 , gameover", 100, 100);
            this.ctx.fillText("when the blue bar on player head reduce to 0 , to next level", 100, 200);
            this.ctx.restore();
    }

    update()
    {
        var now = Date.now();
        var deltaTime = (now - this.previousTime); 
        this.previousTime = now;  

            // check collision with plantform
            for (var i = 0; i < this.obstacle.length; i++)
            {
                if (this.player.checkCollision(this.obstacle[i]))
                {
                    this.player.collideWithObstacle(this.obstacle[i]);
                }
                
                if (this.enemy.checkCollision(this.obstacle[i]))
                {
                    this.enemy.collideWithObstacle(this.obstacle[i]);
                }
                
                if(this.gun.checkCollision(this.obstacle[i]))
                {
                    this.gun.stopFalling();
                }
            }
    
            if (this.enemy.checkCollision(this.gun))
            {
                this.playSound(this.sound["reload"]);
                this.sound["reload"].play = true;
    
                this.gun.respawn();
                this.enemy.collectAmmo();
                //console.log("enemy got it");
            }
    
            if (this.player.checkCollision(this.gun))
            {
                this.playSound(this.sound["reload"]);
                this.sound["reload"].play = true;
    
                this.gun.respawn();
                this.player.collectAmmo();
                //console.log("player got it");
            }
    
            for (var i = 0; i < this.playerBullet.length; i++)
            {
    
                if (this.enemy.checkCollision(this.playerBullet[i]))
                {
                    this.playerBullet.splice(i,1);
                    this.enemy.loseHealth();
                    //console.log("enemy get hit");
                }
            }
    
            for (var i = 0; i < this.enemyBullet.length; i++)
            {
    
                if (this.player.checkCollision(this.enemyBullet[i]))
                {
                    this.enemyBullet.splice(i,1);
                    this.player.loseHealth();
                    //console.log("player get hit");
                }
            }
            
            if (this.player.levelClear())
            {
                this.levelSwitch();
            }
    
            if (this.player.checkGameover())
            {
                this.game.sceneManager.goToScene("Game Over Scene");  
                this.game.sceneManager.render(this.game.ctx);
                // to game over screen
                console.log("gameover");
            }
    
            // move to next level when enemy's health is 0
            if (this.enemy.levelClear())
            {
                this.levelSwitch();
            }
    
            // play sound effect
            if (this.sound != undefined)
            {
                // play the shot sound and create bullet object
                // check the ammo and create bullet object
                if(this.player.shot() && !this.sound["shot"].play && this.player.ammo > 0)
                {
                    this.playSound(this.sound["shot"]);
                    this.sound["shot"].play = true;
    
                    this.playerBullet.push(new Bullet(this.player.x + this.player.width / 2
                                            , this.player.y + this.player.height / 2
                                            , this.player.radians
                                            , "red"));
                }
                else if (this.player.shot() && !this.sound["empty"].play && this.player.ammo <= 0)
                {
                    this.playSound(this.sound["empty"]);
                    this.sound["empty"].play = true;
                }
                else if (!this.player.shot())
                {
                    
                    this.sound["shot"].play = false;
                    this.sound["empty"].play = false;
                }
    
                // play the shot sound and create bullet object
                // check the ammo and create bullet object
                if(this.enemy.shot() && !this.sound["shot2"].play && this.enemy.ammo > 0)
                {
                    this.playSound(this.sound["shot2"]);
                    this.sound["shot2"].play = true;
    
                    this.enemyBullet.push(new Bullet(this.enemy.x + this.enemy.width / 2
                                            , this.enemy.y + this.enemy.height / 2
                                            , this.enemy.targetPosition(this.player.x, this.player.y)
                                            , "blue"));
                }
                else if (this.enemy.shot() && !this.sound["empty2"].play && this.enemy.ammo <= 0)
                {
                    this.playSound(this.sound["empty2"]);
                    this.sound["empty2"].play = true;
                }
                else if (!this.enemy.shot())
                {
                    
                    this.sound["shot2"].play = false;
                    this.sound["empty2"].play = false;
                }
                
                if (!this.sound["background"].play)
                {
                    this.playSound(this.sound["background"]);
                    this.sound["background"].play = true;
                }
            }
    
            // update
            for (var i = 0; i < this.playerBullet.length; i++)
            {
                this.playerBullet[i].update(deltaTime);
                if (!this.playerBullet[i].checkAlive())
                {
                    this.playerBullet.splice(i,1);
                }
            }
    
            for (var i = 0; i < this.enemyBullet.length; i++)
            {
                this.enemyBullet[i].update(deltaTime);
                if (!this.enemyBullet[i].checkAlive())
                {
                    this.enemyBullet.splice(i,1);
                }
            }
    
            this.player.update(deltaTime);
            this.enemy.update(deltaTime);
            this.gun.update(deltaTime);
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
        this.request.open("GET", "http://149.153.106.114:8000/Plantform.json");
        this.request.send();
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