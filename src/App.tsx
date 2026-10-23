import { useRef, useState } from 'react';
import Phaser from 'phaser';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
import { IsoGame } from './game/scenes/IsoGame';
import ProjectOverlay from './components/ProjectOverlay';

function App()
{

    return (
        <div className = "game-container">
            <PhaserGame />
            <ProjectOverlay />
        </div>
    );

}

export default App
