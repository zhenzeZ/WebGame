class Player
{
    constructor(player)
    {
        this.x = player.x;
        this.y = player.y;
        this.previousPositon = {};
        this.width = 40;
        this.height = 39;

        this.leftStickPosition = {x: 200, y: window.innerHeight / 5 * 4};
        this.rightStickPosition = {x: window.innerWidth - 200, y : window.innerHeight / 5 * 4};
        this.stickRadius = 100;
        this.leftStick = this.leftStickPosition;
        this.rightStick = this.rightStickPosition;
        this.radians = 0;

        // movement states
        this.previousPositon = {};
        this.velocity = {x: 0, y:0};
        this.acceleration = {x:0, y:0};
        this.gravity = 9.8;
        this.ground = window.innerHeight;
        this.time = 1 / 10;

        // player states
        this.health = 100;
        this.ammo = 0;
        this.fireRate = 100; // 0.5 sec
        this.fireTimer = this.fireRate;
        this.fire = false;

        this.activeGravity = true;
        this.jump = false;

        this.direction = {x:0, y:0};

        this.img = [new Image(), new Image(),new Image()];

        //get player stand
        this.stand = new Sprite(this.img[0],{x: this.x, y: this.y, width: 40, height: 39, src: "Images/stand.png", maxCount: 1}, 15);
        //get player run
        this.left = new Sprite(this.img[1],{x: this.x, y: this.y, width: 240, height: 39, src: "Images/runLeft.png", maxCount: 6}, 30);
        this.right = new Sprite(this.img[2],{x: this.x, y: this.y, width: 240, height: 39, src: "Images/runRight.png", maxCount: 6}, 30);

        this.healthPos = {x:this.x,y:this.y};
        this.healthW= 50;
        this.healthH= 10;

        this.movement = "stand";
    }

    /**
     * calculate the movement and shooting when player use stick 
     * @param {float} t time per frame
     */
    update(t)
    {
        this.previousPositon.x = this.x;
        this.previousPositon.y = this.y;

        this.direction.x = this.rightStickPosition.x - this.rightStick.x;
        this.direction.y = this.rightStickPosition.y - this.rightStick.y;
        this.radians = Math.atan2(this.direction.y,this.direction.x);
        var distance = Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y);
        if (distance >= 50 && !this.fire)
        {
            this.fire = true;
            if (this.ammo > 0)
            {
                this.ammo --;
            }
            //console.log(this.radians);
        }

        this.direction.x = this.leftStickPosition.x - this.leftStick.x;
        this.direction.y = this.leftStickPosition.y - this.leftStick.y;
        if (this.direction.x > 0)
        {
            if (this.x > 0)
            this.moveLeft();
            this.movement = "left";

            this.left.update(t);
        }
        else if (this.direction.x < 0 )
        {
            if (this.x < window.innerWidth - this.width)
            this.moveRight();
            this.movement = "right";
            this.right.update(t);
        }
        else if (this.direction.x === 0)
        {
            this.stand.update(t);
            this.movement = "stand";
        }

        if (this.direction.y > 30)
        {
            this.moveUp();
        }
        
        this.gravityCalculate();
        this.fireABullet(t);

        this.healthPos.y = this.y - 20;
        this.healthPos.x = this.x;
    }

    fireABullet(t)
    {
        if (this.fire)
        {
            this.fireTimer -= t;
            
            if (this.fireTimer <= 0)
            {
                this.fire = false;
                this.fireTimer = this.fireRate;
            }
            //console.log(this.fireRate)
        }
    }

    gravityCalculate()
    {
        if (this.y > this.ground)
        {
            this.activeGravity = false;
            this.y = this.ground;
            this.jump = true;
        }
        else if (this.y < this.ground)
        {
            this.activeGravity = true;
        }

        if (this.activeGravity)
        {
            this.velocity.y += this.gravity * this.time;
            this.y += this.velocity.y * this.time;
            //this.healthPos.y += this.velocity.y*this.time;
        }
    }

    /**
     * stop the square
     */
    collideWithObstacle(obstacle)
    {
        
        // when player on the plantform
        if (this.y <= obstacle.y - (this.height - this.velocity.y * this.time))
        {
            this.y = obstacle.y - this.height;

            //this.healthPos.y = obstacle.y-this.height-20;

            this.activeGravity = false;
            this.velocity.y = 0;
            this.jump = true;
            //console.log("above");
        }
        // when player under the plantform
        else if (this.y - (this.velocity.y * this.time) > obstacle.y + obstacle.height)
        {
            this.y = obstacle.y + obstacle.height;
            this.velocity.y = 0;
            //console.log("under");
        }
        else if (this.y - (this.velocity.y * this.time) > obstacle.y && this.y < obstacle.y + obstacle.height)
        {
            this.x = this.previousPositon.x;
            this.velocity.x = 0;
            //console.log("same height");
        }
    }


    /**
     * render the square
     * @param {object} ctx 
     */
    render(ctx)
    {        
        ctx.beginPath();
        ctx.strokeStyle = "rgb(255, 255, 255)"
        ctx.arc(this.leftStickPosition.x, this.leftStickPosition.y, this.stickRadius, 0 , 2 * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.rightStickPosition.x, this.rightStickPosition.y, this.stickRadius, 0 , 2 * Math.PI);
        ctx.stroke();

        this.direction.x = this.leftStickPosition.x - this.leftStick.x;
        this.direction.y = this.leftStickPosition.y - this.leftStick.y;
        var distance = Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y);
        if (distance < this.stickRadius)
        {
            ctx.beginPath();
            ctx.arc(this.leftStick.x, this.leftStick.y, 10, 0, 2 * Math.PI); 
            ctx.stroke();
        }

        if (this.direction.x > 0)
        {
            this.left.move(this.x,this.y);
            this.left.draw(ctx);
            //this.width = this.left.width;
        }
        else if (this.direction.x < 0)
        {
            this.right.move(this.x,this.y);
            this.right.draw(ctx);
            //this.width = this.right.width;
        }
        else if (this.direction.x === 0)
        {
            this.stand.move(this.x, this.y);
            this.stand.draw(ctx);
            //this.width = this.stand.width;
        }

        this.direction.x = this.rightStickPosition.x - this.rightStick.x;
        this.direction.y = this.rightStickPosition.y - this.rightStick.y;
        distance = Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y);
        if (distance < this.stickRadius)
        {
            ctx.beginPath();
            ctx.arc(this.rightStick.x, this.rightStick.y, 10, 0, 2 * Math.PI); 
            ctx.stroke();
        }
  
        ctx.fillStyle = "#7CFC00";
        ctx.fillRect(this.healthPos.x, this.healthPos.y, this.healthW, this.healthH);
        

    }

    /**
     * get the touch input from event
     * @param {*} position 
     */
    getPosition(position)
    {
        for (var i = 0; i < position.length; i++)
        {
            if (this.checkDistance(this.stickRadius,this.rightStickPosition, position[i]))
            {
                this.rightStick = {x: position[i].clientX,y: position[i].clientY};
            }

            if (this.checkDistance(this.stickRadius,this.leftStickPosition, position[i]))
            {
                this.leftStick = {x: position[i].clientX,y: position[i].clientY};
            }

        }
    }

    
    resetTouchPosition()
    {
        this.leftStick = this.leftStickPosition;
        this.rightStick = this.rightStickPosition;
    }
    
    /**
     * move the square position to left
     */
    moveLeft()
    {
        this.x -= 2;
        
    }
    
    /**
     * move the square position to right
     */
    moveRight()
    {
        this.x += 2;
        
    }
    
    /**
     * move the square position to up
     */
    moveUp()
    {
        if (this.jump)
        {
            this.velocity.y = -50;
            this.y -= 1;
            this.activeGravity = true;
            this.jump = false;
        }
    }
    
    collectAmmo()
    {
        this.ammo += 10;
    }
    
    loseHealth()
    {
        this.health -= 10;
        this.healthW = 50 * this.health / 100;
    }

     /**
     * check the collision between goal and player
     * @param {Object} square the object for goal
     */
    checkCollision(square)
    {
        if((this.x < square.x + square.width) &&
            (this.x + this.width > square.x) &&
            (this.y + this.height > square.y) &&
            (this.y < square.y + square.height))
        {
            return true;
        }

        return false;
    }

    checkDistance(radius, position1, position2)
    {
        var x = position1.x - position2.clientX;
        var y = position1.y - position2.clientY;
        var distance = Math.sqrt(x * x + y * y);
        if (distance <= radius)
        {
            return true;
        }
        return false;
    }

    /**
     * return true when player's health less then 0
     */
    checkGameover()
    {
        if (this.health <= 0)
        {
            return true;
        }

        return false;
    }

    shot()
    {
        return this.fire
    }

    
    /**
     * switch level
     */
    levelClear()
    {
        if (this.x > 1000)
        {
            return true;
        }
        return false;
    }

    /**
     * reset the position, health and ammo
     * @param {Int} position int value for x and y position
     */
    resetPlayer(position)
    {
        this.x = position.x;
        this.y = position.y;
        this.velocity = {x: 0, y:0};
        this.jump = false;
        this.health = 100;
        this.ammo = 0;
        this.fireTimer = this.fireRate;
        this.fire = false;
        this.healthW= 50;
    }

    getStates(x,y,velocity)
    {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
    }
}