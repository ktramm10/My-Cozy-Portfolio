import { getIsoConfig, getPixelPositionOfTile, getTilePositionOfPixel } from "@/util/IsometricUtils";
import Phaser from "phaser"

export class PlayerCharacter extends Phaser.GameObjects.Sprite {
    private id: string;

    gridX : number;
    gridY : number;

    constructor(id: string, scene: Phaser.Scene, tileX: number, tileY: number, texture : string | Phaser.Textures.Texture, frame? : string | number) {
        super(scene, 0, 0, texture, frame);
        this.id = id;

        this.setGridPosition(tileX + 0.5, tileY + 0.5);
        scene.add.existing(this);
    }

    setGridPosition(gridX: number, gridY: number): void {
        this.gridX = gridX;
        this.gridY = gridY;

        const pixel = getPixelPositionOfTile(gridX, gridY);
        this.setPosition(pixel.x, pixel.y);
    }

    moveOnGrid(deltaGridX: number, deltaGridY: number, canStandAt: (gx: number, gy: number) => boolean): void {
    const nextX = this.gridX + deltaGridX;
    if (canStandAt(nextX, this.gridY)) {
        this.gridX = nextX;
    }
    const nextY = this.gridY + deltaGridY;
    if (canStandAt(this.gridX, nextY)) {
        this.gridY = nextY;
    }
    this.setGridPosition(this.gridX, this.gridY);
}

    getTileIndex() : Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(Math.floor(this.gridX), Math.floor(this.gridY));
    }

    protected preUpdate(time: number, delta: number): void {
        // Sprite's own preUpdate advances animations, so it must still run.
        super.preUpdate(time, delta);

        // implement for animation
    }

}
