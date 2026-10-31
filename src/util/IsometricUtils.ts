import Phaser from 'phaser';

export interface IsoConfig {
    tileWidth: number;   // map.tileWidth
    tileHeight: number;  // map.tileHeight (top face height)
    originX: number;     // screen x of tile (0,0)'s top corner
    originY: number;     // screen y of tile (0,0)'s top corner
    rows: number;        // map.height -> range of gridX
    cols: number;        // map.width  -> range of gridY
}

let iso: IsoConfig = { tileWidth: 100, tileHeight: 50, originX: 960, originY: 300, rows: 10, cols: 10 };

export function configureIsometric(config: IsoConfig): void {
    iso = config;
}

export function getIsoConfig(): IsoConfig {
    return iso;
}


export function getPixelPositionOfTile(x: number, y: number): Phaser.Math.Vector2 {
    const resX = (y - x) * (iso.tileWidth / 2) + iso.originX;
    const resY = (y + x) * (iso.tileHeight / 2) + iso.originY;
    return new Phaser.Math.Vector2(resX, resY);
}


export function getTilePositionOfPixel(x: number, y: number): Phaser.Math.Vector2 {
    const a = (x - iso.originX) / (iso.tileWidth / 2);
    const b = (y - iso.originY) / (iso.tileHeight / 2);

    const gridX = Math.floor((b - a) / 2);
    const gridY = Math.floor((b + a) / 2);
    return new Phaser.Math.Vector2(gridX, gridY);
}


export function tiledObjectToGrid(objX: number, objY: number): { gridX: number; gridY: number } {
    return { gridX: objY / iso.tileHeight, gridY: objX / iso.tileHeight };
}