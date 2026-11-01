import VolumeSlider from "./VolumeSlider"

interface PortfolioHeaderProps {
    showVolume: boolean;
}

export default function PortfolioHeader({ showVolume }: PortfolioHeaderProps) {

return (
    <header>
        <div className="portfolio-header-container">
            <h1>Keith's Cozy Portfolio</h1>
            {showVolume && <VolumeSlider />}
        </div>
    </header>
);


}
