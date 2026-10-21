import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import { Input } from 'phaser';

interface WASDKeys {
    W: Input.Keyboard.Key;
    A: Input.Keyboard.Key;
    S: Input.Keyboard.Key;
    D: Input.Keyboard.Key;
}

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    wasdKeys!: WASDKeys;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(512, 384, 'background');

        this.logo = this.add.image(512, 300, 'logo').setDepth(100);
        this.wasdKeys = this.input.keyboard!.addKeys('W,A,S,D') as WASDKeys;
        

        EventBus.emit('current-scene-ready', this);
    }

    update(time: number, delta: number): void {
        let dx = 0;
        let dy = 0;

        const speed = 200; // Pixels per second
        const dt = delta / 1000; // Milliseconds to seconds

        if (this.wasdKeys.W.isDown) {
            dy -= 1;
        }

        if (this.wasdKeys.A.isDown) {
            dx -= 1;
        }

        if (this.wasdKeys.S.isDown) {
            dy += 1;
        }

        if (this.wasdKeys.D.isDown) {
            dx += 1;
        }

        // Normalize diagonal movement
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length > 0) {
            dx /= length;
            dy /= length;
        }
        this.moveLogo(dx * speed * dt, dy * speed * dt);
    }

    moveLogo (dx: number, dy:number)
    {
        this.logo.setPosition(this.logo.x + dx, this.logo.y + dy);
        
    }
}
