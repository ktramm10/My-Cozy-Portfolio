import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { getPixelPositionOfTile } from '@/util/IsometricUtils';
import { projectZones } from '@/util/projectZones';
import Phaser from 'phaser';
import { PlayerCharacter } from '../components/PlayerCharacter';

interface Controls {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    E: Phaser.Input.Keyboard.Key;
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
    private keys! : Controls;
    private activeZoneId: string | null = null;
    private isPCInZone: boolean = false;

   
    

    constructor ()
    {
        super('IsoGame');
    }

    create () {
        this.createMap();
        this.playerCharacter = new PlayerCharacter("pc", this, 5, 5, "player_idle", 0);
        this.playerCharacter.setScale(.2, .2)
        this.playerCharacter.setOrigin(.5, 1);

        this.keys = {
            W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            E: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E),
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
            if (this.playerCharacter.anims.currentAnim?.key !== "idle") {
            this.playerCharacter.anims.play("idle");
            }
        }

        this.playerCharacter.moveOnGrid(direction.x * distance, direction.y * distance);

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
 