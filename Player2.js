class Player2
{
    constructor(enemy)
    {
        this.x = enemy.x;
        this.y = enemy.y;
        this.previousPositon = {};
        this.width = 40;
        this.height = 39;

        // movement states
        this.previousPositon = {};
        this.velocity = {x: 0, y:0};
        this.acceleration = {x:0, y:0};
        this.gravity = 9.8;
        this.ground = window.innerHeight;
        this.time = 1 / 10;

        // player states
        this.health = 100;
        this.ammo = 5;
        this.fireRate = 1500; // 1.5 sec
        this.fireTimer = this.fireRate;
        this.fire = true;

        this.activeGravity = true;
        this.jump = false;
        this.tutorial = true;

        this.direction = {x:0, y:0};

        this.movement = "stand";

        this.img = [new Image(), new Image(),new Image()];

        //get player stand
        this.stand = new Sprite(this.img[0],{x: this.x, y: this.y, width: 40, height: 39, src: "Images/stand.png", maxCount: 1}, 15);
        //get player run

        this.left = new Sprite(this.img[1],{x: this.x, y: this.y, width: 240, height: 39, src: "Images/runLeft.png", maxCount: 6}, 30);
        this.right = new Sprite(this.img[2],{x: this.x, y: this.y, width: 240, height: 39, src: "Images/runRight.png", maxCount: 6}, 30);

        this.healthPos = {x:this.x,y:this.y};
        this.healthW= 50;
        this.healthH= 10;

    }

    update(t)
    {
        this.previousPositon.x = this.x;
        this.previousPositon.y = this.y;

        // shot bullet when player is not in tutorial level
        if (!this.fire && !this.tutorial)
        {
            this.fire = true;
            if (this.ammo > 0)
            {
                this.ammo --;
            }
        }

        // control the ai enemy movement
        switch (this.movement) {
            case "stand":
                this.stand.update(t);
                break;
            case "left":
                this.left.update(t);
                break;
            case "right":
                this.right.update(t);
                break;
            default:
                break;
        }
        
        this.gravityCalculate();

        this.healthPos.y = this.y - 20;
        this.healthPos.x = this.x;
    }

    gravityCalculate()
    {
        if (this.y > this.ground)
        {
            this.activeGravity = false;
            this.y = this.ground;
            if (!this.tutorial)
            {
                this.jump = true;
            }
        }
        else if (this.y < this.ground)
        {
            this.activeGravity = true;
        }

        if (this.activeGravity)
        {
            this.velocity.y += this.gravity * this.time;
            this.y += this.velocity.y * this.time;
            //this.healthPos.y+=this.velocity.y*this.time;
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
            if (!this.tutorial)
            {
                this.jump = true;
            }
        }
        // when player under the plantform
        else if (this.y - (this.velocity.y * this.time) > obstacle.y + obstacle.height)
        {
            this.y = obstacle.y + obstacle.height;
            this.velocity.y = 0;
        }
        else if (this.y - (this.velocity.y * this.time) > obstacle.y && this.y < obstacle.y + obstacle.height)
        {
            this.x = this.previousPositon.x;
            this.velocity.x = 0;
            if (this.movement == "right")
            {
                this.movement = "left"
            }
            else if (this.movement == "left")
            {
                this.movement = "right"
            }
        }
    }

    /**
     * render the square
     * @param {object} ctx 
     */
    render(ctx)
    {        
        switch (this.movement) {
            case "stand":
                this.stand.move(this.x, this.y);
                this.stand.draw(ctx);
                break;
            case "left":
                this.left.move(this.x,this.y);
                this.left.draw(ctx);
                break;
            case "right":
                this.right.move(this.x,this.y);
                this.right.draw(ctx);
                break;
            default:
                break;
        }
        ctx.fillStyle = "#0000ff";
        ctx.fillRect(this.healthPos.x, this.healthPos.y, this.healthW, this.healthH);

    }

    getStates(x, y, velocity, movement)
    {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.movement = movement;
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
     * get ammo
     */
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
     * move the square position to up
     */
    moveUp()
    {
        if (this.jump && !this.tutorial)
        {
            this.velocity.y = -50;
            this.y -= 1;
            this.activeGravity = true;
            this.jump = false;
        }
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
     * reset the position, health and ammo
     * @param {Int} position int value for x and y position
     */
    resetEnemy(position)
    {
        this.x = position.x;
        this.y = position.y;
        this.velocity = {x: 0, y:0};
        this.jump = false;
        this.tutorial = false;
        this.health = 100;
        this.ammo = 0;
        this.fireTimer = this.fireRate;
        this.fire = false;
        this.healthW= 50;
        this.movement = "stand";
    }
    
    tutorialPositionEnemy()
    {
        this.movement = "stand";
        this.jump = false;
        this.tutorial = true;
    }
}