import { GameObjects, Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { getPixelPositionOfTile } from '@/util/IsometricUtils';
import { projectZones, ProjectZone } from '@/util/projectZones';
import Phaser from 'phaser';

interface Point {
    x: number;
    y: number;
}

interface WASDKeys {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
}


export class IsoGame extends Scene
{
    private tileWidth = 100;
    private tileHeight = 50;
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
    private sprite! : Phaser.GameObjects.Sprite;
    private keys! : WASDKeys;
    private activeZoneId: string | null = null;

   
    

    constructor ()
    {
        super('IsoGame');
    }

    create () {
        this.createMap();
        let position = getPixelPositionOfTile(5, 5);
        this.sprite = this.add.sprite(position.x, position.y, "player", 0);
        this.sprite.setScale(.2, .2)
        this.sprite.setOrigin(.5, 1);

        this.keys = {
            W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        };

    }

    createMap() {
        const originX = this.scale.width / 2;
        const originY = 300;

        for (let row = 0; row < this.mapData.length; row++) {
            for (let col = 0; col < this.mapData.length; col++) {
                const x = (col - row) * (this.tileWidth / 2) + originX;
                const y = (col + row) * (this.tileHeight / 2) + originY;

                this.add.image(x, y, this.mapData[row][col]).setOrigin(0.5, 0);
            }
        }
    }

    checkProjectZones(): void {
        const playerX = this.sprite.x;
        const playerY = this.sprite.y;

        const activeZone = projectZones.find((zone) => {
            const bounds = new Phaser.Geom.Rectangle(zone.x, zone.y, zone.width, zone.height);
            return bounds.contains(playerX, playerY);
        });

        const newZoneId = activeZone?.id ?? null;

        if (newZoneId === this.activeZoneId) {
            return;
        }
        this.activeZoneId = newZoneId;
        EventBus.emit("project-zone-changed", activeZone ?? null);

    }



    update(time: number, delta: number): void {
        const speed = 200;
        const dt = delta / 1000;

        let dx = 0;
        let dy = 0;

        if (this.keys.W.isDown) {
            console.log("W is down")
            dy -= 1;
        }

        if (this.keys.A.isDown) {
            console.log("A is down")

            dx -= 1;
        }

        if (this.keys.S.isDown) {
            console.log("S is down")

            dy += 1
        }

        if (this.keys.D.isDown) {
            console.log("D is down")

            dx += 1;
        }

        const direction = new Phaser.Math.Vector2(dx, dy);
        if (direction.lengthSq() > 0) {
            direction.normalize();
        }


        this.sprite.x += direction.x * speed * dt;
        this.sprite.y += direction.y * speed * dt;

        this.checkProjectZones();

    }

    



    
}
 