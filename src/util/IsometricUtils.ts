import Phaser from "phaser";
import { TILE_WIDTH, TILE_HEIGHT, SCENE_WIDTH, SCENE_HEIGHT } from "./Constants";

const originX = SCENE_WIDTH / 2;
const originY = 300;

export function getPixelPositionOfTile(x : number, y : number) : Phaser.Math.Vector2 {

    const res_x = (y - x) * (TILE_WIDTH / 2) + originX;
    const res_y = (y + x) * (TILE_HEIGHT / 2) + originY;

    return new Phaser.Math.Vector2(res_x, res_y);
}

export function getTilePositionOfPixel(x: number, y: number) : Phaser.Math.Vector2 {
    // Inverse of getPixelPositionOfTile:
    //   a = (x - originX) / (TILE_WIDTH / 2)  = gridY - gridX
    //   b = (y - originY) / (TILE_HEIGHT / 2) = gridY + gridX
    const a = (x - originX) / (TILE_WIDTH / 2);
    const b = (y - originY) / (TILE_HEIGHT / 2);

    // Tiles are drawn with origin (0.5, 0), so the pixel position is the diamond's
    // top corner; flooring maps any pixel inside the diamond to that tile's index.
    const gridX = Math.floor((b - a) / 2);
    const gridY = Math.floor((b + a) / 2);
    return new Phaser.Math.Vector2(gridX, gridY);
}