class Sprite
{
    /**
     * 
     * @param {object} image image function 
     * @param {Array} imageOptions array for image states
     * @param {object} context window canvas
     * @param {int} fps the frame per second
     */
    constructor(image,imageOptions,fps)
    {
        this.imageCount = -1;
        this.image = image;
        this.image.src = imageOptions.src;
        this.maxCount = imageOptions.maxCount;

        this.sourceX = 0;
        this.sourceY = 0;

        this.positionX = imageOptions.x;
        this.positionY = imageOptions.y;

        this.width = imageOptions.width / this.maxCount;
        this.height = imageOptions.height;

        this.ticksPerFrame = 1000 / fps;
        this.time = 0;
    }

    /**
     * switch the source position for sprite sheet
     * @param {int} t the time program run once
     */
    update(t)
    {
        this.time += t
        if (this.time >= this.ticksPerFrame && this.maxCount != 1)
        {
            this.imageCount ++;
            if (this.imageCount > this.maxCount)
            {
                this.imageCount = 0;
            }
            this.sourceX = this.imageCount * this.width;
            this.time = 0;
        }
    }

    move(x,y)
    {
        this.positionX = x;
        this.positionY = y;
    }

    /**
     * draw one frame from image
     */
    draw(ctx)
    {
        ctx.drawImage(this.image,this.sourceX, this.sourceY,
            this.width, this.height,
            this.positionX, this.positionY,
            this.width,this.height );

    }
}
