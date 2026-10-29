import Phaser from 'phaser';
import { getPixelPositionOfTile, getTilePositionOfPixel } from '@/util/IsometricUtils';
import { TILESETS } from '../textures/tilesets';

export interface Prop {
    baseY: number;
    baseTile: Phaser.Math.Vector2;
    blocksMovement: boolean;
}


interface PropPiece {
    stampKey: string;
    textureKey: string;
    frame: number;
    x: number; 
    y: number;
    cellBottomY: number; 
    width: number;
    flipX: boolean;
}


export function createPropsFromTileLayer(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap, layerName: string): Prop[] {
    const layer = map.getLayer(layerName);
    if (!layer) {
        console.warn(`No tile layer named "${layerName}" in the map (check the name in Tiled)`);
        return [];
    }
    const blocksMovement = hasTrueProperty(layer.properties, 'blocked');

    const piecesByStamp = new Map<string, PropPiece[]>();
    for (const row of layer.data) {
        for (const tile of row) {
            const piece = toPropPiece(map, tile);
            if (piece) {
                piecesByStamp.set(piece.stampKey, [...(piecesByStamp.get(piece.stampKey) ?? []), piece]);
            }
        }
    }

    return [...piecesByStamp.values()].map((pieces) => createProp(scene, pieces, blocksMovement));
}


export function createSingleTileProp(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap, tile: Phaser.Tilemaps.Tile): Prop | null {
    const piece = toPropPiece(map, tile);
    return piece ? createProp(scene, [piece], false) : null;
}

function createProp(scene: Phaser.Scene, pieces: PropPiece[], blocksMovement: boolean): Prop {
    const baseY = Math.max(...pieces.map((p) => p.cellBottomY));
    const bottomRow = pieces.filter((p) => p.cellBottomY === baseY);
    const left = Math.min(...bottomRow.map((p) => p.x - p.width / 2));
    const right = Math.max(...bottomRow.map((p) => p.x + p.width / 2));
    const baseX = (left + right) / 2;

    for (const piece of pieces) {
        scene.add.image(piece.x, piece.y, piece.textureKey, piece.frame)
            .setOrigin(0.5, 1)
            .setFlipX(piece.flipX)
            .setDepth(baseY);
    }

    return {
        baseY,
        baseTile: getTilePositionOfPixel(baseX, baseY - 1),
        blocksMovement,
    };
}

function toPropPiece(map: Phaser.Tilemaps.Tilemap, tile: Phaser.Tilemaps.Tile): PropPiece | null {
    if (tile.index < 0) {
        return null;
    }
    const tileset = findTilesetForGid(map, tile.index);
    const textureKey = TILESETS.find((t) => t.name === tileset?.name)?.key;
    if (!tileset || !textureKey) {
        console.warn(`Prop tile ${tile.index} uses a tileset that isn't in TILESETS`);
        return null;
    }
    const frame = tile.index - tileset.firstgid;


    const cellBottom = getPixelPositionOfTile(tile.y + 1, tile.x + 1);
    const bottomCentre = cellBottom.clone().add(tileset.tileOffset);

    const sheetColumn = frame % tileset.columns;
    const sheetRow = Math.floor(frame / tileset.columns);
    const stampX = bottomCentre.x - tileset.tileWidth / 2 - sheetColumn * tileset.tileWidth;
    const stampY = bottomCentre.y - tileset.tileHeight - sheetRow * tileset.tileHeight;

    return {
        stampKey: `${tileset.name}@${stampX},${stampY}`,
        textureKey: `${textureKey}-sheet`,
        frame,
        x: bottomCentre.x,
        y: bottomCentre.y,
        cellBottomY: cellBottom.y,
        width: tileset.tileWidth,
        flipX: tile.flipX,
    };
}


function findTilesetForGid(map: Phaser.Tilemaps.Tilemap, gid: number): Phaser.Tilemaps.Tileset | undefined {
    return [...map.tilesets]
        .sort((a, b) => a.firstgid - b.firstgid)
        .filter((tileset) => tileset.firstgid <= gid)
        .pop();
}


function hasTrueProperty(properties: unknown, name: string): boolean {
    return Array.isArray(properties) && properties.some((p) => p.name === name && p.value === true);
}
