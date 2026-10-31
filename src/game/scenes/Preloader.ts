import { Scene } from 'phaser';
import { TILESETS, TileSetImportTemplate } from '../textures/tilesets';

export const PLAYER_SHEET = 'player';
const PLAYER_FRAMES_PER_ROW = 8;

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init () {
        const { width, height } = this.scale;
        this.add.rectangle(width / 2, height / 2, 300, 20).setStrokeStyle(2, 0xf3e6c4);
        const bar = this.add.rectangle(width / 2 - 148, height / 2, 4, 16, 0xf3e6c4).setOrigin(0, 0.5);
        this.load.on('progress', (p: number) => { bar.width = 4 + 292 * p; });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.tilemapTiledJSON('cozy_map', 'maps/cozy.json');

        for (const t of TILESETS) {
            this.load.image(t.key, t.file);
            this.load.spritesheet(`${t.key}-sheet`, t.file, {frameWidth: t.tileWidth, frameHeight: t.tileHeight, spacing: t.spacing, margin: t.margin});
        }

        this.load.spritesheet(PLAYER_SHEET, 'character_sprite/AdventurerWalk64x64.png', {frameWidth: 64, frameHeight: 64});

        this.load.audio('background-music', 'music/Sunlight Through Leaves.ogg');
    }

    create ()
    {
        this.createRowAnimation("run_down_left_right", 0);
        this.createRowAnimation("run_left_right", 1);
        this.createRowAnimation("run_up_left_right", 2);
        this.createRowAnimation("run_up", 3);
        this.createRowAnimation("run_down", 7);

        this.scene.start('IsoGame');
    }

    private createRowAnimation(key: string, row: number): void {
        const start = row * PLAYER_FRAMES_PER_ROW;
        this.anims.create({
            key,
            frames: this.anims.generateFrameNumbers(PLAYER_SHEET, { start, end: start + PLAYER_FRAMES_PER_ROW - 1 }),
            frameRate: 10,
            repeat: -1,
        });
    }
}
