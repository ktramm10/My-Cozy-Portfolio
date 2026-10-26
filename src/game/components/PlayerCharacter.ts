import { getPixelPositionOfTile, Point } from "@/util/IsometricUtils";
import Phaser from "phaser"

export class PlayerCharacter extends Phaser.GameObjects.Sprite {
    private id: string;

    // Position on the isometric grid, measured in tiles. These are fractional
    // (e.g. 5.5, 5.5) so the player can stand anywhere on a tile, not only on corners.
    gridX : number;
    gridY : number;

    constructor(id: string, scene: Phaser.Scene, tileX: number, tileY: number, texture : string | Phaser.Textures.Texture, frame? : string | number) {
        super(scene, 0, 0, texture, frame);
        this.id = id;

        // +0.5 puts the player in the middle of the tile instead of on its top corner.
        this.setGridPosition(tileX + 0.5, tileY + 0.5);
        scene.add.existing(this);
    }

    // The grid position is the source of truth; the on-screen pixel position is derived from it.
    setGridPosition(gridX: number, gridY: number): void {
        this.gridX = gridX;
        this.gridY = gridY;

        const pixel = getPixelPositionOfTile(gridX, gridY);
        this.setPosition(pixel.x, pixel.y);
    }

    moveOnGrid(deltaGridX: number, deltaGridY: number): void {
        this.setGridPosition(this.gridX + deltaGridX, this.gridY + deltaGridY);
    }

    // The whole-number index of the tile the player is standing on.
    getTileIndex() : Point {
        return { x: Math.floor(this.gridX), y: Math.floor(this.gridY) };
    }

    protected preUpdate(time: number, delta: number): void {
        // Sprite's own preUpdate advances animations, so it must still run.
        super.preUpdate(time, delta);

        // implement for animation
    }

}
