/**
 * This function will serve as an entry point for our program.
 */
function main()
{
    const game = new Game();

    window.resizeTo(1000,1000);

    game.update();
}
