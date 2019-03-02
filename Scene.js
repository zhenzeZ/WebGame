/**
 * Base class for inheritance of all game scenes
 */
class Scene
{
    /**
     * contructor of scene class
     * setting title and colour of scene
     * @param {String} title title of the scene
     * @param {String} colour colour of scene
     */
    constructor(title,colour)
    {
        this.title = title;
        this.colour = colour;
    }

    start()
    {
        console.log("Starting");
    }

    stop()
    {
        console.log("Stopping");
    }

     /**
     * render the scene 
     * colour of background changed
     * change font/size/position
     * @param {object} ctx canvas context
     */
    render(ctx)
    {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        document.body.style.background = this.colour;
        ctx.font = '48px serif';
        ctx.fillText(this.title, 10, 50);
    }
}