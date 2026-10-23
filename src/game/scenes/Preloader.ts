import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {

    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');
        this.load.image('grass', 'grass.png');
        this.load.image('sand', 'sand.png');
        this.load.image('water', 'water.png');

        this.load.spritesheet("player", "/CharacterSprite/Character0_idle.png", {frameWidth: 460, frameHeight: 460}) 
    }

    create ()
    {
        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('IsoGame');
    }
}
