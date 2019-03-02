class Bullet
{
    constructor(x,y, radians, color)
    {
       this.x=x;
       this.y=y;
       this.width = 5;
       this.height =5;
       this.active = true;
       this.time = 3000;
       this.speed = 10.0;
       this.radians = radians;
       this.color = color;
       this.velocity = {x: this.speed * Math.cos(this.radians) * -1,y: this.speed * Math.sin(this.radians) * -1};
    }
    render(ctx)
    {
        ctx.fillStyle= this.color;
            
        ctx.fillRect(this.x, this.y, this.width, this.height);  
    }
    update(t)
    {
        /*
        if(this.active===true)
        {
            this.x +=20*this.speed;
        }
        if(this.x>window.innerWidth || this.x<0
            || this.y>window.innerHeight || this.y<0)
        {
            this.reset();
        }
        */
       this.time -= t;

       if (this.time <= 0)
       {
           this.active = false;
       }

       // move the bullet
       this.x += this.velocity.x;
       this.y += this.velocity.y;

    }

    reset()
    {
        this.speed = 0;
        this.fired = false;
        this.y = 100;
    }

    checkAlive()
    {
        return this.active;
    }

}