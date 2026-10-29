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

    init ()
    {

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
