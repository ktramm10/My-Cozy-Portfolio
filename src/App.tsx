
import { PhaserGame } from './PhaserGame';

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
