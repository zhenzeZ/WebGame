/**
 * Scene Manager class that 
 * adds a specific scene
 * goes to specific scene 
 * goes to the next scene
 * renders the scene
 */
class SceneManager
{
    /**
     * scenemanager constructor with 
     * reference to the current scene 
     * dictionary of the scenes
     * list of the scene titles
     * index used for each scene
     */
    constructor()
    {
        this.currentScene = null;   
        this.dictionaryScene = {}; 
        this.sceneTitleList = [];   
        this.index = -1;            
    }

    /**
     * scene object is being passed in
     * adds to the scene title list 
     * adds the scene object to dictionary
     * @param {Object} scene scene object being passed in
     */
    addScene(scene)
    {
        this.dictionaryScene[scene.title] = scene;
        this.sceneTitleList.push(scene.title);
    }

    /**
     * goes to the title of scene thats being passed im
     * sets this scene as the current scene
     * @param {string} title string title of the scene object
     */
    goToScene(title)
    {
        //error checking
        if (this.currentScene != null)
        {
            this.currentScene.stop();
        }
        
        //error checking
        if (undefined != this.currentScene)
        {
            this.currentScene.start();
        }

        //set current scene by looking at the dictionary using title as key
        this.currentScene = this.dictionaryScene[title];
    }

    /**
     * goes to next scene which is in the list
     * called when mouse is clicked
     */
    goToNextScene()
    {
         //error checking
         if (this.currentScene != null)
         {
            this.currentScene.stop();
         }
 
         //error checking
         if (undefined != this.currentScene)
         {
            this.currentScene.start();
         }  

        //update current index with list index
        this.index = this.sceneTitleList.indexOf(this.currentScene.title);

        
        this.index = (this.index + 1) % this.sceneTitleList.length;

        //current scene is set using updated index 
        this.currentScene =  this.dictionaryScene[this.sceneTitleList[this.index]];
    }
    
    /**
     * calls render function of the current scene
     * @param {Object} ctx canvas context passed to draw. 
     */
    render(ctx)
    {
        ctx.clearRect(0, 0, window.innerWidth,window.innerHeight);
        this.currentScene.render(ctx);
    }
    update()
    {
        this.currentScene.update();
    }
}
