import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { configureIsometric, getIsoConfig, getPixelPositionOfTile, tiledObjectToGrid } from '@/util/IsometricUtils';
import { projectZones, ZoneArea } from '@/util/projectZones';
import Phaser from 'phaser';
import { PlayerCharacter } from '../components/PlayerCharacter';
import { TILESETS } from '../textures/tilesets';
import { createPropsFromTileLayer, createSingleTileProp } from '../world/props';
import { PLAYER_SHEET } from './Preloader';
import { CAMERA_FOLLOW_LERP, MAP_ZOOM, TALL_ART_MARGIN } from '@/util/Constants';

interface Controls {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    E: Phaser.Input.Keyboard.Key;
}


const FLAT_LAYERS = ['water', 'ground', 'ground_deco', 'zone_tiles'];
const WALKABLE_LAYER = 'ground';  
const PROP_LAYER = 'trees';       
const ZONE_OBJECT_LAYER = 'zone_objects';
const DECORATION_LAYERS = ['ground_deco'];

const tileKey = (row: number, col: number): string => `${row},${col}`;


export class IsoGame extends Scene
{
    private map!: Phaser.Tilemaps.Tilemap;
    private flatLayers = new Map<string, Phaser.Tilemaps.TilemapLayer>();
    private blockedTiles = new Set<string>();

    private canStandAt = (gridX: number, gridY: number): boolean => {
        const row = Math.floor(gridX);
        const col = Math.floor(gridY);
        const onGround = this.flatLayers.get(WALKABLE_LAYER)?.getTileAt(col, row) != null;
        return onGround && !this.blockedTiles.has(tileKey(row, col));
    }

    private readonly playerSpeed = 3; // tiles per second
    private playerCharacter! : PlayerCharacter;
    private keys! : Controls;
    private activeZoneId: string | null = null;
    private zoneAreas: ZoneArea[] = [];

    private backgroundMusic!: Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound;


    constructor ()
    {
        super('IsoGame');
    }

    create () {
        const startVolume = this.registry.get('musicVolume') ?? 0.5;
        this.backgroundMusic = this.sound.add('background-music', {loop: true, volume: startVolume}) as any;
        this.backgroundMusic.play();
        EventBus.on('set-music-volume', this.setMusicVolume, this);

        this.createMap();
        this.loadZoneAreas();
        this.createProps();

        this.playerCharacter = new PlayerCharacter("pc", this, 29 , 29, PLAYER_SHEET, 0);
        this.playerCharacter.setOrigin(.5, 50 / 64);

        this.keys = {
            W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            E: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        };

        this.setupCamera();


        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            EventBus.off('set-music-volume', this.setMusicVolume, this);
        });

        EventBus.emit('current-scene-ready', this);
    }

    private setMusicVolume(value: number) {
        this.registry.set('musicVolume', value);
        this.backgroundMusic.setVolume(value);
    }

    private loadZoneAreas(): void {
        const layer = this.map.getObjectLayer(ZONE_OBJECT_LAYER);
        const tileHeight = this.map.tileHeight;

        for (const obj of layer?.objects ?? []) {
            const props = (obj.properties ?? []) as {name: string; value: unknown }[];
            const projectId = props.find((p) => p.name === 'projectId')?.value;
            const project = projectZones.find((z) => z.id === projectId);
            if (!project) {
                console.warn(`Zone objects ${obj.id} has unknown projectId`, projectId);
                continue;
            }
            const start = tiledObjectToGrid(obj.x ?? 0, obj.y ?? 0);

            const isPoint = !obj.width || !obj.height;
            this.zoneAreas.push({
                project,
                gridX: isPoint ? Math.floor(start.gridX) : start.gridX,
                gridY: isPoint ? Math.floor(start.gridY) : start.gridY,
                rows: isPoint ? 1 : obj.height! / tileHeight,
                cols: isPoint ? 1 : obj.width! / tileHeight,
            });
        }
    }


    private createProps(): void {
        for (const prop of createPropsFromTileLayer(this, this.map, PROP_LAYER)) {
            if (prop.blocksMovement) {
                this.blockedTiles.add(tileKey(prop.baseTile.x, prop.baseTile.y));
            }
        }

        for (const layerName of DECORATION_LAYERS) {
            this.applyDecorationTileProperties(layerName);
        }
    }


    private applyDecorationTileProperties(layerName: string): void {
        const layer = this.flatLayers.get(layerName);
        if (!layer) {
            console.warn(`"${layerName}" is in DECORATION_LAYERS but not in FLAT_LAYERS`);
            return;
        }

        layer.forEachTile((tile) => {
            if (tile.properties.blocked === true) {
                this.blockedTiles.add(tileKey(tile.y, tile.x));
            }
            if (tile.properties.renderFront === true && createSingleTileProp(this, this.map, tile)) {
                layer.removeTileAt(tile.x, tile.y); 
            }
        }, undefined, undefined, undefined, undefined, undefined, { isNotEmpty: true });
    }


    private setupCamera(): void {
        const camera = this.cameras.main;
        camera.setZoom(MAP_ZOOM);
        camera.roundPixels = true; 

        const bounds = this.getCameraBounds(camera.width / MAP_ZOOM, camera.height / MAP_ZOOM);
        camera.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
        camera.startFollow(this.playerCharacter, true, CAMERA_FOLLOW_LERP, CAMERA_FOLLOW_LERP);
    }


    private getCameraBounds(viewWidth: number, viewHeight: number): Phaser.Geom.Rectangle {
        const { rows, cols } = getIsoConfig();
        const left = getPixelPositionOfTile(rows, 0).x;     
        const right = getPixelPositionOfTile(0, cols).x;    
        const bottom = getPixelPositionOfTile(rows, cols).y; 
        const top = getPixelPositionOfTile(0, 0).y - TALL_ART_MARGIN;
        const center = getPixelPositionOfTile(rows / 2, cols / 2);

        const fitAxis = (min: number, max: number, viewSize: number, mid: number): [number, number] =>
            max - min >= viewSize ? [min, max - min] : [mid - viewSize / 2, viewSize];

        const [x, width] = fitAxis(left, right, viewWidth, center.x);
        const [y, height] = fitAxis(top, bottom, viewHeight, center.y);
        return new Phaser.Geom.Rectangle(x, y, width, height);
    }


    private alignTilesWithTiled(layer: Phaser.Tilemaps.TilemapLayer): void {
        const gridTileHeight = this.map.tileHeight;
        layer.forEachTile((tile) => {
            const tileset = tile.tileset;
            if (!tileset) {
                return;
            }
            tile.pixelX += 2 * tileset.tileOffset.x;
            tile.pixelY += (gridTileHeight - tileset.tileHeight) + 2 * tileset.tileOffset.y;
        });
    }

    createMap() {
        this.map = this.make.tilemap({key: 'cozy_map',});
        const tilesets = TILESETS.map((t) => {
            const tileset = this.map.addTilesetImage(t.name, t.key);
            if (!tileset) {
                throw new Error(`Tileset "${t.name}" is not in the map (check the name in Tiled)`);
            }
            return tileset;
        });

        const layerX = (this.map.height - 1) * this.map.tileWidth / 2;
        const layerY = 0;


        FLAT_LAYERS.forEach((name, index) => {
            const layer = this.map.createLayer(name, tilesets, layerX, layerY);
            if (!(layer instanceof Phaser.Tilemaps.TilemapLayer)) {
                throw new Error(`No tile layer named "${name}" in the map (check the name in Tiled)`);
            }
            this.alignTilesWithTiled(layer);
            layer.setDepth(index - FLAT_LAYERS.length);
            this.flatLayers.set(name, layer);
        });


        configureIsometric({
            tileWidth: this.map.tileWidth,
            tileHeight: this.map.tileHeight,
            originX: layerX + this.map.tileWidth / 2,
            originY: layerY,
            rows: this.map.height,
            cols: this.map.width,
        });
    }

    checkProjectZones(): void {
        const { gridX, gridY } = this.playerCharacter;
        const area = this.zoneAreas.find((a) =>
            gridX >= a.gridX && gridX < a.gridX + a.rows &&
            gridY >= a.gridY && gridY < a.gridY + a.cols
        );
        const newZoneId = area?.project.id ?? null;
        if (newZoneId === this.activeZoneId) {
            return;
        }
        this.activeZoneId = newZoneId;
        EventBus.emit('project-zone-changed', area?.project ?? null);
    }



    update(time: number, delta: number): void {
        this.playerCharacter.setDepth(this.playerCharacter.y);
        const direction = this.getGridDirectionFromInput();
        const distance = this.playerSpeed * (delta / 1000); // tiles to move this frame

        if (direction.x == -1 && direction.y == 0) { // w movement
            this.playerCharacter.anims.play("run_up_left_right", true);
            this.playerCharacter.flipX = true;
        }
        else if (direction.x == 1 && direction.y == 0) { // s movement
            this.playerCharacter.anims.play("run_down_left_right", true);
            this.playerCharacter.flipX = false;
        }
        else if (direction.x == 0 && direction.y == 1) { // d movement
            this.playerCharacter.anims.play("run_down_left_right", true);
            this.playerCharacter.flipX = true;
        } 
        else if (direction.x == 0 && direction.y == -1) { // a movement
            this.playerCharacter.anims.play("run_up_left_right", true);
            this.playerCharacter.flipX = false;
        }
        else if (direction.x < 0 && direction.y > 0) { // w + d movement --> right
            this.playerCharacter.anims.play("run_left_right", true);
            this.playerCharacter.flipX = true;
        }
        else if (direction.x < 0 && direction.y < 0) { // w + a movement --> up
            this.playerCharacter.anims.play("run_up", true);
            this.playerCharacter.flipX = false;
        }
        else if (direction.x > 0 && direction.y > 0) { // s + d movement --> down
            this.playerCharacter.anims.play("run_down", true);
            this.playerCharacter.flipX = false;
        }
        else if (direction.x > 0 && direction.y < 0) { // s + a movement --> left
            this.playerCharacter.anims.play("run_left_right", true);
            this.playerCharacter.flipX = false;
        }
        else if (direction.x == 0 && direction.y == 0) {
            this.playerCharacter.anims.stop();
            this.playerCharacter.setTexture('player', 58);
        }

        this.playerCharacter.moveOnGrid(direction.x * distance, direction.y * distance, this.canStandAt);

        this.checkProjectZones();
        if (this.keys.E.isDown) {
            EventBus.emit("project-interaction-activated");
        }
    }

    
    private getGridDirectionFromInput(): Phaser.Math.Vector2 {
        const direction = new Phaser.Math.Vector2(0, 0);

        if (this.keys.W.isDown) direction.x -= 1;
        if (this.keys.S.isDown) direction.x += 1;
        if (this.keys.A.isDown) direction.y -= 1;
        if (this.keys.D.isDown) direction.y += 1;

        
        return direction.normalize();
    }

    



    
}
 