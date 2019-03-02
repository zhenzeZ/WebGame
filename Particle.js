class Particle
{
    constructor(x,y,velX,velY)
    {
        this.timeToLive =Math.floor((Math.random() * 150) + 1);
        this.velocity = {x:velX,y:velY};
        this.height=10;
        this.width=10;
        this.x = x;
        this.y = y;
    }
    render(ctx)
    {
        if(this.timeToLive>0)
        {
            ctx.fillStyle= "red";
            
            ctx.fillRect(this.x, this.y, this.width, this.height);  
        }
    }
    update()
    {
        if(this.timeToLive>0)
        {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.timeToLive--;
        }
    }
}
// class Particle
// {
//   constructor(locationX, locationY)
//   {
//     this.location = []
//     this.location.x = locationX
//     this.location.y = locationY
//     this.velocity = []
//     this.velocity.x =(Math.random()*3)*-1
//     this.velocity.y =(Math.random()*3)*-1
//     this.acceleration = []
//     this.acceleration.x = 0
//     this.acceleration.y = -0
//     this.lifespan = 1

//     this.img = new Image()
//     this.img.src = "Images/stars.png"
//   }

//   run()
//   {
//     this.update()
//     this.render()
//   }

//   update()
//   {
//     this.velocity.x += this.acceleration.x
//     this.velocity.y += this.acceleration.y
//     this.location.x += this.velocity.x
//     this.location.y += this.velocity.y

//     this.lifespan -=0.005
//   }

//   render()
//   {
//     var canvas = document.getElementById('mycanvas')
//     var ctx = canvas.getContext('2d')


//     ctx.globalAlpha = this.lifespan
//     var image = this.img
//     ctx.drawImage(image, this.location.x,this.location.y)
//   }

// }
