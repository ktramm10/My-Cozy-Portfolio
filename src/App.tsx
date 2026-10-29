
import { PhaserGame } from './PhaserGame';
import PortfolioFooter from './components/PortfolioFooter';
import PortfolioHeader from './components/PortfolioHeader';
import PortfolioSideBar from './components/PortfolioSideBar';
import ProjectOverlay from './components/ProjectOverlay';

function App()
{

    return (
        <div className = "game-container">
            <PortfolioHeader />
            <div className="game-main">
                <PhaserGame />
                <PortfolioSideBar />
            </div>
            <ProjectOverlay />
            <PortfolioFooter />
        </div>
    );

}

export default App
