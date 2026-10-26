import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { getPixelPositionOfTile } from '@/util/IsometricUtils';
import { projectZones } from '@/util/projectZones';
import Phaser from 'phaser';
import { PlayerCharacter } from '../components/PlayerCharacter';

interface WASDKeys {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
}


export class IsoGame extends Scene
{
    private readonly playerSpeed = 4; // tiles per second
    private mapData = [
        ['water', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
        ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
        ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
        ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
        ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
        ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
        ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
        ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
        ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
        ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'water']
    ];
    private playerCharacter! : PlayerCharacter;
    private keys! : WASDKeys;
    private activeZoneId: string | null = null;

   
    

    constructor ()
    {
        super('IsoGame');
    }

    create () {
        this.createMap();
        this.playerCharacter = new PlayerCharacter("pc", this, 5, 5, "player", 0);
        this.playerCharacter.setScale(.2, .2)
        this.playerCharacter.setOrigin(.5, 1);

        this.keys = {
            W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        };

    }

    createMap() {
        // row is the tile's gridX and col is its gridY, the same convention the player uses.
        for (let row = 0; row < this.mapData.length; row++) {
            for (let col = 0; col < this.mapData[row].length; col++) {
                const { x, y } = getPixelPositionOfTile(row, col);
                this.add.image(x, y, this.mapData[row][col]).setOrigin(0.5, 0);
            }
        }
    }

    checkProjectZones(): void {
        const playerTile = this.playerCharacter.getTileIndex();

        const activeZone = projectZones.find((zone) =>
            zone.tileX === playerTile.x && zone.tileY === playerTile.y
        );

        const newZoneId = activeZone?.id ?? null;

        if (newZoneId === this.activeZoneId) {
            return;
        }
        this.activeZoneId = newZoneId;
        EventBus.emit("project-zone-changed", activeZone ?? null);

    }



    update(time: number, delta: number): void {
        const direction = this.getGridDirectionFromInput();
        const distance = this.playerSpeed * (delta / 1000); // tiles to move this frame

        this.playerCharacter.moveOnGrid(direction.x * distance, direction.y * distance);

        this.checkProjectZones();
    }

    // Turns WASD into a direction on the isometric grid (x = gridX, y = gridY), not on the screen.
    // Each key follows one grid axis, which on screen is a 2:1 diagonal:
    //   W: gridX - 1  ->  up-right   (+2 right, -1 up)
    //   S: gridX + 1  ->  down-left
    //   A: gridY - 1  ->  up-left
    //   D: gridY + 1  ->  down-right
    private getGridDirectionFromInput(): Phaser.Math.Vector2 {
        const direction = new Phaser.Math.Vector2(0, 0);

        if (this.keys.W.isDown) direction.x -= 1;
        if (this.keys.S.isDown) direction.x += 1;
        if (this.keys.A.isDown) direction.y -= 1;
        if (this.keys.D.isDown) direction.y += 1;

        // Keeps diagonal movement (e.g. W + D) from being faster than a single key.
        // Phaser's normalize() leaves a zero vector alone, so no key pressed is safe.
        return direction.normalize();
    }

    



    
}
 