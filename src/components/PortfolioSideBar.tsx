'use client'
import {useState} from 'react';
import { projectZones} from '@/util/projectZones';
import GitHubStats from './GitHubStats';

// Tech tags shown per project card; the full list is in the in-game overlay
const CARD_TECH_COUNT = 3;

interface PortfolioSideBarProps {
    // On mobile the game isn't loaded, so the sidebar fills the page and always lists the projects
    isMobile: boolean;
}

export default function PortfolioSideBar({ isMobile }: PortfolioSideBarProps) {
    const [dropDownToggle, setDropDownToggle] = useState<boolean>(false);
    const showProjects = isMobile || dropDownToggle;

    function activateDropDown() {
        setDropDownToggle(prev => !prev);
    }

    return (
        <aside className='side-bar-container'>
            <GitHubStats />

            {isMobile ? (
                <p className='touch-note'>The game needs a keyboard, so visit on a computer to explore the world. Here are the projects:</p>
            ) : (
                <div className='skip-game'>
                    <p>Want to skip the game and see the projects?</p>
                    <button
                        className='skip-game-button'
                        onClick={activateDropDown}
                        aria-expanded={dropDownToggle}
                        aria-controls='project-display'
                    >
                        Skip The Game {dropDownToggle ? '▲' : '▼'}
                    </button>
                </div>
            )}

            {showProjects && (
                <div id='project-display' className='project-display'>
                    <h3 className='sidebar-section-title'>Projects</h3>
                    {projectZones.map((project) => (
                        <article key={project.id} className='project-item'>
                            <h4>{project.name}</h4>
                            <p>{project.description}</p>
                            <ul className='project-item-tech'>
                                {project.techStack.slice(0, CARD_TECH_COUNT).map((tech) => (
                                    <li key={tech}>{tech}</li>
                                ))}
                            </ul>
                            <a href={project.githubUrl} target='_blank' rel="noopener noreferrer">View on GitHub</a>
                        </article>
                    ))}
                </div>
            )}
        </aside>
    );
}
