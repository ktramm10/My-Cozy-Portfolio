import { useState } from 'react';
import dynamic from 'next/dynamic';
import PortfolioFooter from './components/PortfolioFooter';
import PortfolioHeader from './components/PortfolioHeader';
import PortfolioSideBar from './components/PortfolioSideBar';
import ProjectOverlay from './components/ProjectOverlay';
import { isTouchDevice } from './util/device';

// Loaded on demand so touch devices never download Phaser or the game assets
const PhaserGame = dynamic(() => import('./PhaserGame').then((mod) => mod.PhaserGame), { ssr: false });

function App()
{
    const [isMobile] = useState<boolean>(isTouchDevice);

    return (
        <div className = "game-container">
            <PortfolioHeader showVolume={!isMobile} />
            <div className={`game-main${isMobile ? ' mobile' : ''}`}>
                {!isMobile && <PhaserGame />}
                <PortfolioSideBar isMobile={isMobile} />
            </div>
            {!isMobile && <ProjectOverlay />}
            <PortfolioFooter />
        </div>
    );

}

export default App
