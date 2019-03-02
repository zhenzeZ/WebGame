/**
 * Constructor function to initialise this sprite with the canvas context
 *  and a set of image options. The image options specify both image and
 *  animation properties. For example, image width, image height, the image
 *  object and the y coordinate where the image should be drawn.
 *  The animation properties include the ticks per frame and number of 
 *  frames.
 * @param {context} context The 2D context for the canvas.
 * @param {Object} imageOptions An object describing the image and animation     
 *                  properties.
 * @param {int} x frames per second
 * @param {int} x x position of sprite
 * @param {int} y y position of sprite
 */
class Gun 
{
    constructor(context, imageOptions, fps, x, y)
    {
       this.width = imageOptions.width;
       this.height = imageOptions.height;
       this.image = imageOptions.image;
       this.ctx = context;
       this.index = 0;
       this.tickCount = 0;
       this.ticksPerFrame = 1000 / fps;
       this.frameNum = 10 || 1; 
       this.x = x;
       this.y = y;
       this.fallingSpeed=5;
       this.alive=true;
       this.timeAlive=500;
       this.spawnDelay = 300;
   }

   /**
    * update function called every frame by game class
    * @param {time} deltaTime passes deltatime value from game class
    */
   update(deltaTime)
   {
       this.animation(deltaTime)
       this.y+=this.fallingSpeed;
       if(this.fallingSpeed===0)
       {
           //console.log(this.timeAlive);
           this.decreaseTimeAlive()
       }
       if(this.timeAlive===0)
       {
           this.respawn();
       }
   }

   animation(deltaTime)
   {
        var dt = deltaTime;
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame)
        {
            this.tickCount = 0;
            if (this.index < this.frameNum - 1)
            {
             this.index+=1;
            }
            else
            {
             this.index = 0;
            }
        }
   }
   
   /**
    * draw function drawing the animating sprite
    * @param {object} ctx The 2D context for the canvas.
    */
   draw(ctx)
   {
       ctx.drawImage(
        this.image,
        this.index * this.width,
        0,
        this.width ,
        this.height,
        this.x,
        this.y,
        this.width ,
        this.height);
   }
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

   respawn()
   {
        this.timeAlive=500;
        this.fallingSpeed=5;
        this.y=-44;
        this.x = Math.random() * window.innerWidth;
   }

   stopFalling()
   {
        this.fallingSpeed=0;
   }

   decreaseTimeAlive()
   {
    this.timeAlive-=10;
   }
   
   getStates(x,y)
   {
       this.x = x;
       this.y = y;
   }
}
