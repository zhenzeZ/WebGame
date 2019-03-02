class ParticleSystem
{

    constructor()
    {
        this.maxParticles = 150;
        this.position = {x:0,y:0};
        gamee.particles = [];
    }

    init(posX,posY)
    {
        this.position.x = posX;
        this.position.y = posY;
        
        for (var i = 0; i < 50; i++)
        {
          gamee.particles.push(new Particle(posX,posY,
            Math.floor((Math.random() * 20) + 1),
            Math.floor((Math.random() * 20) + 1)));
        }
            
    }
    update()
    {
      if (gamee.particles.length > 0)
      {

        for(var i=0;i<gamee.particles.length;i++)
        {
          gamee.particles[i].update();
        }
      }
    }
    render(ctx)
    {
      if (gamee.particles.length > 0)
      {

        for(var i=0;i<gamee.particles.length;i++)
        {
          gamee.particles[i].render(ctx);
        }
      }
    }
}
// class ParticleSystem
// {
//   constructor(x, y)
//   {
//     console.log("game constructed")
//     this.createPart = false;
//     gamee.particles = []

//   }


//   update(x,y)
//   {
//     var canvas = document.getElementById('mycanvas')
//     var ctx = canvas.getContext('2d')


//     if(gamee.particles.length<20 && this.createPart === true)
//     {
//         gamee.particles.push(new Particle(x-10, y+50))
//         if(gamee.particles.length>=20)
//         {
//           this.createPart = false
//         }

//     }

//     for(var i =0; i < gamee.particles.length; i++)
//     {
//         gamee.particles[i].run()
//       if(gamee.particles[i].lifespan <0.15)
//       {
//         gamee.particles.splice(i,1)
//       }

//     }


//   }

// }
