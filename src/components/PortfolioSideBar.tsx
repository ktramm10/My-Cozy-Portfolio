'use client'
import {useState} from 'react';
import { projectZones} from '@/util/projectZones';
import GitHubStats from './GitHubStats';

// Tech tags shown per project card; the full list is in the in-game overlay
const CARD_TECH_COUNT = 3;

// Touch screens can't use the WASD/E controls. App is loaded client-only, so window is available here.
function isTouchDevice() {
    return window.matchMedia('(pointer: coarse)').matches;
}

export default function PortfolioSideBar() {
    const [isTouch] = useState<boolean>(isTouchDevice);
    // On touch devices the project list starts open, since the game can't be played
    const [dropDownToggle, setDropDownToggle] = useState<boolean>(isTouch);

    function activateDropDown() {
        setDropDownToggle(prev => !prev);
    }

    return (
        <aside className='side-bar-container'>
            <GitHubStats />

            <div className='skip-game'>
                {isTouch ? (
                    <p className='touch-note'>The game needs a keyboard (WASD to move, E to open). Here are the projects instead:</p>
                ) : (
                    <p>Want to skip the game and see the projects?</p>
                )}
                <button
                    className='skip-game-button'
                    onClick={activateDropDown}
                    aria-expanded={dropDownToggle}
                    aria-controls='project-display'
                >
                    Skip The Game {dropDownToggle ? '▲' : '▼'}
                </button>
            </div>

            {dropDownToggle && (
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
