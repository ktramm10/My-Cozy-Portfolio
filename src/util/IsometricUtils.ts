import { TILE_WIDTH, TILE_HEIGHT, SCENE_WIDTH, SCENE_HEIGHT } from "./Constants";


export interface Point {
    x: number;
    y: number;
}

export function getPixelPositionOfTile(x : number, y : number) : Point {
        const originX = SCENE_WIDTH / 2;
        const originY = 300;

        const res_x = (y - x) * (TILE_WIDTH / 2) + originX;
        const res_y = (y + x) * (TILE_HEIGHT / 2) + originY;

        return { x : res_x, y : res_y};
}