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

        this.load.spritesheet("player_idle", "CharacterSprite/Character0_Idle.png", {frameWidth: 460, frameHeight: 460});
        this.load.spritesheet("player_run", "CharacterSprite/Character0_Run.png", {frameWidth: 460, frameHeight: 460});
    }

    create ()
    {
        // Animations are created here, not in preload(): the spritesheets only exist once loading
        // has finished, and generateFrameNumbers() on a missing texture returns no frames.
        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers('player_idle', {start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "run_down_left_right",
            frames: this.anims.generateFrameNumbers("player_run", {start: 4, end: 7}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "run_up_left_right",
            frames: this.anims.generateFrameNumbers("player_run", {start: 12, end: 15}),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "run_down",
            frames: this.anims.generateFrameNumbers("player_run",{start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "run_up",
            frames: this.anims.generateFrameNumbers("player_run", {start: 16, end: 19}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "run_left_right",
            frames: this.anims.generateFrameNumbers("player_run", {start: 8, end: 11}),
            frameRate: 10,
            repeat: -1
        });
        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('IsoGame');
    }
}
